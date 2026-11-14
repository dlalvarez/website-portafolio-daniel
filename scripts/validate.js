// Valida content/site.json, las traducciones de content/i18n/*.json y que las imágenes existan.
// Uso: npm run validate
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const d = read('content/site.json');
const errs = [], slugs = new Set(), ids = new Set();
const img = (p, w) => { if (p && !p.startsWith('data:') && !fs.existsSync(path.join(root, p))) errs.push(`${w}: falta la imagen ${p}`); };

/* ----- datos neutrales ----- */
for (const p of d.projects) {
  if (!d.categories.includes(p.category)) errs.push(`${p.title}: categoría desconocida "${p.category}" (usa un id de "categories")`);
  if (slugs.has(p.slug)) errs.push(`slug duplicado: ${p.slug}`); slugs.add(p.slug);
  if (!p.image && !(p.art && d.palettes[p.art.palette])) errs.push(`${p.title}: sin imagen ni arte válido`);
  img(p.image, p.title); (p.images || []).forEach(i => img(i, p.title));
}
for (const w of d.works) {
  if (!w.id) { errs.push(`trabajo sin "id" (${w.client})`); continue; }
  if (ids.has(w.id)) errs.push(`id de trabajo duplicado: ${w.id}`); ids.add(w.id);
  if (!d.categories.includes(w.category)) errs.push(`${w.id}: categoría desconocida "${w.category}"`);
  if (!w.image && !(w.art && d.palettes[w.art.palette])) errs.push(`${w.id}: sin imagen ni arte válido`);
  img(w.image, w.id);
}
img(d.about && d.about.portrait, 'retrato');

/* ----- traducciones ----- */
const langs = d.languages || [];
if (!langs.length) errs.push('site.json: falta "languages"');
if (!langs.some(l => l.code === d.defaultLanguage)) errs.push(`defaultLanguage "${d.defaultLanguage}" no está en "languages"`);
const base = langs.length ? read(`content/i18n/${d.defaultLanguage}.json`) : null;
for (const { code } of langs) {
  const file = `content/i18n/${code}.json`;
  if (!fs.existsSync(path.join(root, file))) { errs.push(`falta ${file}`); continue; }
  const L = read(file), w = `[${code}]`;
  for (const k of Object.keys(base.ui)) if (!(k in (L.ui || {}))) errs.push(`${w} falta ui."${k}"`);
  for (const k of Object.keys(L.ui || {})) if (!(k in base.ui)) errs.push(`${w} ui."${k}" no existe en ${d.defaultLanguage} (¿errata?)`);
  for (const k of Object.keys(base.site)) if (!L.site || !L.site[k]) errs.push(`${w} falta site.${k}`);
  for (const k of ['eyebrow', 'intro']) if (!L.hero || !L.hero[k]) errs.push(`${w} falta hero.${k}`);
  if (!L.hero || (L.hero.lines || []).length !== base.hero.lines.length) errs.push(`${w} hero.lines debe tener ${base.hero.lines.length} líneas`);
  for (const k of ['lead', 'text']) if (!L.about || !L.about[k]) errs.push(`${w} falta about.${k}`);
  for (const k of ['stats', 'process', 'awards'])
    if (!L.about || (L.about[k] || []).length !== base.about[k].length) errs.push(`${w} about.${k} debe tener ${base.about[k].length} elementos`);
  for (const c of d.categories) if (!L.categories || !L.categories[c]) errs.push(`${w} falta la etiqueta de categoría "${c}"`);
  for (const p of d.projects) {
    const x = L.projects && L.projects[p.slug];
    if (!x || !x.description) errs.push(`${w} proyecto "${p.slug}": falta description`);
    else if (!Array.isArray(x.tags) || x.tags.length !== (base.projects[p.slug] || {}).tags.length) errs.push(`${w} proyecto "${p.slug}": tags distintos en número a ${d.defaultLanguage}`);
  }
  for (const wk of d.works) if (!(L.works && L.works[wk.id] && L.works[wk.id].title)) errs.push(`${w} trabajo "${wk.id}": falta title`);
}

if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
console.log(`OK · ${d.projects.length} proyectos, ${d.works.length} trabajos, ${langs.length} idiomas (${langs.map(l => l.code).join(', ')})`);
