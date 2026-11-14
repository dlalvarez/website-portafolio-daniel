// Servidor sin dependencias: sitio estático + POST /api/contact
// Variables: PORT (3000) · CONTACT_WEBHOOK (URL, p. ej. n8n) · TRUST_PROXY=1 (detrás de nginx/traefik)
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = +process.env.PORT || 3000;
const WEBHOOK = process.env.CONTACT_WEBHOOK || '';
const TRUST_PROXY = process.env.TRUST_PROXY === '1';
const DATA_DIR = path.join(ROOT, 'data');
const PUBLIC = new Set(['index.html', 'styles.css', 'script.js']);
const PUBLIC_DIRS = ['content', 'assets'];
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.mp4': 'video/mp4'
};
const SEC = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY'
};

const send = (res, code, body, headers = {}) => { res.writeHead(code, { ...SEC, ...headers }); res.end(body); };
const json = (res, code, obj) => send(res, code, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });

/* ---------- Estático ---------- */
function serveStatic(req, res) {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { return send(res, 400, 'Bad request'); }
  if (p === '/') p = '/index.html';
  const rel = path.normalize(p).replace(/^[/\\]+/, '');
  const top = rel.split(path.sep)[0];
  if (rel.includes('..') || !(PUBLIC.has(rel) || PUBLIC_DIRS.includes(top))) return send(res, 404, 'No encontrado');
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep)) return send(res, 404, 'No encontrado');
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'No encontrado');
    const ext = path.extname(file).toLowerCase();
    const cache = rel.startsWith('assets') ? 'public, max-age=86400' : 'no-cache';
    res.writeHead(200, { ...SEC, 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': cache });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

/* ---------- Contacto ---------- */
const hits = new Map(); // ip -> [timestamps]
function limited(ip) {
  const now = Date.now(), win = 3600e3, list = (hits.get(ip) || []).filter(t => now - t < win);
  if (list.length >= 5) { hits.set(ip, list); return true; }
  list.push(now); hits.set(ip, list); return false;
}
setInterval(() => { const n = Date.now(); for (const [k, v] of hits) if (!v.some(t => n - t < 3600e3)) hits.delete(k); }, 600e3).unref();

function readBody(req, max = 10_000) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > max) { reject(Object.assign(new Error('Cuerpo demasiado grande'), { code: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function contact(req, res) {
  const ip = (TRUST_PROXY && req.headers['x-forwarded-for']?.split(',')[0].trim()) || req.socket.remoteAddress;
  if (!/^application\/json/.test(req.headers['content-type'] || '')) return json(res, 415, { error: 'Content-Type inválido', code: 'type' });
  let b;
  try { b = JSON.parse(await readBody(req)); } catch (e) { return json(res, e.code || 400, { error: 'Solicitud inválida', code: 'request' }); }
  if (b.website) return json(res, 200, { ok: true }); // honeypot: se descarta en silencio
  const name = String(b.name || '').trim(), email = String(b.email || '').trim(), message = String(b.message || '').trim();
  if (name.length < 1 || name.length > 120) return json(res, 400, { error: 'Nombre inválido', code: 'name' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return json(res, 400, { error: 'Correo inválido', code: 'email' });
  if (message.length < 10 || message.length > 3000) return json(res, 400, { error: 'El mensaje debe tener entre 10 y 3000 caracteres', code: 'message' });
  if (limited(ip)) return json(res, 429, { error: 'Demasiados mensajes, inténtalo más tarde', code: 'rate' });

  const lang = /^[a-z]{2}(-[A-Za-z]{2})?$/.test(b.lang) ? b.lang : 'es'; // idioma desde el que escribió (para responderle en el mismo)
  const entry = { at: new Date().toISOString(), lang, name, email, message };
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(path.join(DATA_DIR, 'messages.jsonl'), JSON.stringify(entry) + '\n', { mode: 0o600 });
  } catch (e) { console.error('No se pudo guardar el mensaje:', e.message); return json(res, 500, { error: 'No se pudo guardar el mensaje', code: 'save' }); }

  if (WEBHOOK) { // aviso opcional (n8n, etc.); un fallo aquí no pierde el mensaje, ya está guardado
    fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry), signal: AbortSignal.timeout(8000) })
      .then(r => { if (!r.ok) console.error('Webhook respondió', r.status); })
      .catch(e => console.error('Webhook falló:', e.message));
  }
  json(res, 200, { ok: true });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/api/contact') {
    if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido', code: 'method' });
    return contact(req, res).catch(e => { console.error(e); json(res, 500, { error: 'Error interno', code: 'internal' }); });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Método no permitido');
  serveStatic(req, res);
});
if (require.main === module) server.listen(PORT, () => console.log(`Portafolio en http://localhost:${PORT}`));
module.exports = server;
