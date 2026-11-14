// Valida content/site.json y que las imágenes referenciadas existan. Uso: npm run validate
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const d = JSON.parse(fs.readFileSync(path.join(root, 'content/site.json'), 'utf8'));
const errs = [], slugs = new Set();
const img = (p, w) => { if (p && !fs.existsSync(path.join(root, p))) errs.push(`${w}: falta la imagen ${p}`); };
for (const p of d.projects) {
  if (!d.categories.includes(p.category)) errs.push(`${p.title}: categoría desconocida "${p.category}"`);
  if (slugs.has(p.slug)) errs.push(`slug duplicado: ${p.slug}`); slugs.add(p.slug);
  if (!p.image && !(p.art && d.palettes[p.art.palette])) errs.push(`${p.title}: sin imagen ni arte válido`);
  img(p.image, p.title); (p.images || []).forEach(i => img(i, p.title));
}
for (const w of d.works) { if (!w.image && !(w.art && d.palettes[w.art.palette])) errs.push(`${w.title}: sin imagen ni arte válido`); img(w.image, w.title); }
img(d.about.portrait, 'retrato');
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
console.log(`OK · ${d.projects.length} proyectos, ${d.works.length} trabajos`);
