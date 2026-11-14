/* =========================================================
   Portafolio — el contenido vive en content/site.json
   ========================================================= */
let PAL={},CATS=[],PROJECTS=[],WORKS=[],SITE={};
/* ---------- Generador de arte (SVG procedural, reproducible) ---------- */
function rng(seed){let s=seed>>>0||1;return()=>((s=Math.imul(s^s>>>15,2246822507)+1013904223>>>0)/4294967296)}
function hash(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function art(kind,pal,seed,title=''){
  const r=rng(hash(seed)),P=PAL[pal]||PAL.mono,pick=()=>P[1+Math.floor(r()*3)],W=400,H=500;
  let g='';
  const letter=(title.trim()[0]||'A').toUpperCase();
  if(kind==='poster'){
    const cx=100+r()*200;
    g+=`<circle cx="${cx}" cy="${170+r()*60}" r="${90+r()*40}" fill="${P[1]}"/>`;
    g+=`<rect x="${r()*120}" y="${280+r()*40}" width="${160+r()*160}" height="${30+r()*50}" fill="${P[2]}"/>`;
    g+=`<path d="M0 ${H} L${120+r()*100} ${330+r()*40} L${H} ${H}Z" fill="${P[3]}" opacity=".95"/>`;
    g+=`<circle cx="${60+r()*280}" cy="${60+r()*60}" r="${14+r()*22}" fill="${P[2]}"/>`;
    g+=`<text x="28" y="${H-30}" font-family="Fraunces,serif" font-size="46" fill="${P[0]===(PAL.noche||[])[0]?P[3]:P[2]}" letter-spacing="-2">${title.split(' ')[0]}</text>`;
  }else if(kind==='logo'){
    const s=r()>.5;
    g+=s?`<rect x="110" y="140" width="180" height="180" rx="${r()>.5?90:8}" fill="${P[1]}"/>`:`<circle cx="200" cy="230" r="95" fill="${P[1]}"/>`;
    g+=`<text x="200" y="${s?272:271}" text-anchor="middle" font-family="Fraunces,serif" font-style="italic" font-size="130" fill="${P[0]}">${letter}</text>`;
    g+=`<text x="200" y="400" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" letter-spacing="6" fill="${P[2]}">${title.toUpperCase()}</text>`;
    g+=`<line x1="170" y1="420" x2="230" y2="420" stroke="${P[3]}" stroke-width="2"/>`;
  }else if(kind==='pack'){
    g+=`<rect y="400" width="${W}" height="100" fill="${P[2]}" opacity=".12"/>`;
    const n=2+Math.floor(r()*2),w=n===2?130:96,gap=22,x0=(W-(n*w+(n-1)*gap))/2;
    for(let i=0;i<n;i++){
      const x=x0+i*(w+gap),h=230+r()*60,y=420-h,c=i?P[3]:P[1];
      g+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${c}"/>`;
      g+=`<rect x="${x}" y="${y}" width="${w}" height="26" rx="6" fill="${P[2]}"/>`;
      g+=`<circle cx="${x+w/2}" cy="${y+h*.45}" r="${w*.27}" fill="${P[0]}"/>`;
      g+=`<text x="${x+w/2}" y="${y+h*.45+14}" text-anchor="middle" font-family="Fraunces,serif" font-size="40" fill="${P[2]}">${letter}</text>`;
      g+=`<rect x="${x+14}" y="${y+h-44}" width="${w-28}" height="3" fill="${P[0]}"/><rect x="${x+14}" y="${y+h-30}" width="${(w-28)*.6}" height="3" fill="${P[0]}" opacity=".7"/>`;
    }
  }else if(kind==='editorial'){
    g+=`<text x="-20" y="420" font-family="Fraunces,serif" font-size="520" font-weight="300" fill="${P[1]}" letter-spacing="-20">${letter}</text>`;
    g+=`<rect x="28" y="28" width="${120+r()*100}" height="3" fill="${P[2]}"/>`;
    for(let i=0;i<4;i++)g+=`<rect x="28" y="${44+i*10}" width="${60+r()*100}" height="2" fill="${P[2]}" opacity=".5"/>`;
    g+=`<rect x="28" y="${H-64}" width="344" height="1" fill="${P[2]}"/>`;
    g+=`<text x="28" y="${H-34}" font-family="Fraunces,serif" font-size="26" fill="${P[2]}">${title}</text>`;
    g+=`<circle cx="${330}" cy="${70}" r="${12+r()*10}" fill="${P[3]}"/>`;
  }else{ // pattern
    const n=4,s=W/n;
    for(let i=0;i<n;i++)for(let j=0;j<5;j++){
      const x=i*s,y=j*100,c=pick(),t=Math.floor(r()*5),rr=s/2;
      if(t===0)g+=`<circle cx="${x+rr}" cy="${y+50}" r="${r()*38+10}" fill="${c}"/>`;
      else if(t===1)g+=`<path d="M${x} ${y+100} A${s} ${s} 0 0 1 ${x+s} ${y}V${y+100}Z" fill="${c}"/>`;
      else if(t===2)g+=`<rect x="${x+10}" y="${y+10}" width="${s-20}" height="80" fill="${c}"/>`;
      else if(t===3)g+=`<path d="M${x} ${y}A${s} ${s} 0 0 1 ${x+s} ${y+100}H${x}Z" fill="${c}"/>`;
      else g+=`<path d="M${x+rr} ${y+8}L${x+s-8} ${y+92}H${x+8}Z" fill="${c}"/>`;
    }
  }
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${title}"><rect width="${W}" height="${H}" fill="${P[0]}"/>${g}</svg>`;
}

/* ---------- Utilidades ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const count=f=>PROJECTS.filter(f).length;
const visual=(o,alt)=>o.image?`<img src="${esc(o.image)}" alt="${esc(alt)}" loading="lazy" decoding="async">`:art(o.art.kind,o.art.palette,o.slug||o.title,o.title);
const slugOf=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

/* ---------- Render ---------- */
const state={cat:'Todos',client:null};
const grid=$('[data-grid]');

function renderStatic(){
  document.title=SITE.title||document.title;
  $('meta[name=description]')?.setAttribute('content',SITE.description||'');
  $$('[data-name]').forEach(e=>e.firstChild.textContent=SITE.name);
  $('[data-hero-eyebrow]').textContent=`${H.eyebrow} · ${SITE.location} — ${SITE.availability}`;
  $('[data-hero-title]').innerHTML=H.lines.map(l=>`<span class="line"><span>${l}</span></span>`).join('');
  $('[data-hero-intro]').textContent=H.intro;
  $('[data-lead]').textContent=A.lead;$('[data-about-text]').textContent=A.text;
  $('[data-stats]').innerHTML=A.stats.map(s=>`<div><dt>${esc(s.n)}</dt><dd>${esc(s.l)}</dd></div>`).join('');
  $('[data-process]').innerHTML=A.process.map((p,i)=>`<li><span>0${i+1}</span><b>${esc(p.t)}</b><p>${esc(p.d)}</p></li>`).join('');
  $('[data-awards]').innerHTML=A.awards.map(a=>`<li><span>${esc(a.y)}</span>${esc(a.t)}</li>`).join('');
  const m=$('[data-mail]');m.href=`mailto:${SITE.email}`;m.textContent=SITE.email;
  $('[data-address]').innerHTML=esc(SITE.address).replace(', ','<br>');
  $('[data-social]').innerHTML=SITE.social.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('<br>');
  $('[data-footer]').textContent=`© ${new Date().getFullYear()} ${SITE.name}`;
  $('[data-portrait]').innerHTML=A.portrait?`<img src="${esc(A.portrait)}" alt="Retrato de ${esc(SITE.name)}">`:art('pattern',Object.keys(PAL)[0],'retrato',SITE.name);
}
function renderGrid(){
  grid.innerHTML=PROJECTS.map((p,i)=>`
    <article class="card reveal ${p.featured?'wide':''}" data-i="${i}" tabindex="0" role="button" aria-label="Abrir ${esc(p.title)}" style="--d:${(i%3)*.08}s">
      <div class="card-art">${visual(p,p.title)}</div>
      <div class="card-info"><h3>${esc(p.title)}</h3><span>${esc(p.category)} · ${p.year}</span></div>
    </article>`).join('');
  $('[data-count]').textContent=`(${PROJECTS.length})`;
}
function renderFilters(){
  const wrap=$('[data-filters]'),all=['Todos',...CATS];
  wrap.innerHTML=all.map(c=>`<button class="chip" role="tab" data-cat="${esc(c)}">${esc(c)}<small>${c==='Todos'?PROJECTS.length:count(p=>p.category===c)}</small></button>`).join('')
    +`<button class="chip on" data-clear hidden></button>`;
  $('[data-clear]',wrap).addEventListener('click',()=>setFilter('Todos',null));
  wrap.addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(b)setFilter(b.dataset.cat,null)});
  setFilter('Todos',null,true);
}
function setFilter(cat,client,instant){
  state.cat=cat;state.client=client;
  $$('[data-cat]',$('[data-filters]')).forEach(b=>{const on=!client&&b.dataset.cat===cat;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  const clr=$('[data-clear]');clr.hidden=!client;if(client)clr.textContent=`Cliente: ${client} ✕`;
  const cards=$$('.card',grid);
  if(!instant)cards.forEach(c=>c.classList.add('hidden'));
  setTimeout(()=>{
    let n=0;
    cards.forEach((c,i)=>{
      const p=PROJECTS[i],ok=(cat==='Todos'||p.category===cat)&&(!client||p.client===client);
      c.classList.toggle('gone',!ok);
      if(ok){n++;requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.transitionDelay=`${n*.05}s`;c.classList.remove('hidden')}))}
    });
    grid.querySelector('.empty')?.remove();
    if(!n)grid.insertAdjacentHTML('beforeend','<p class="empty">Sin proyectos en esta selección.</p>');
  },instant?0:320);
}
function renderWorks(){
  const years=[...new Set(WORKS.map(w=>w.year))].sort((a,b)=>b-a);
  $('[data-works]').innerHTML=years.map(y=>`
    <div class="year reveal" id="trabajos-${y}"><h3>${y}</h3><div>
      ${WORKS.map((w,i)=>w.year===y?`<div class="work" data-w="${i}" tabindex="0" role="button" aria-label="Abrir ${esc(w.title)}">
        <b>${esc(w.title)}</b><span>${esc(w.category)}</span><span>${esc(w.client)}</span><i>↗</i></div>`:'').join('')}
    </div></div>`).join('');
  $('[data-wcount]').textContent=`(${WORKS.length})`;
}
function renderClients(){
  const names=[...new Set([...PROJECTS.map(p=>p.client),...WORKS.map(w=>w.client)])];
  $('[data-clients]').innerHTML=names.map(n=>{
    const c=count(p=>p.client===n);
    return `<li class="client reveal"><button data-client="${esc(n)}"><b>${esc(n)}</b><small>${c?c+' proyecto'+(c>1?'s':''):'Trabajos puntuales'}</small></button></li>`}).join('');
  $('[data-ccount]').textContent=`(${names.length})`;
  $('[data-clients]').addEventListener('click',e=>{
    const b=e.target.closest('[data-client]');if(!b)return;
    const n=b.dataset.client;
    if(!count(p=>p.client===n)){openWork(WORKS.findIndex(w=>w.client===n));return}
    document.getElementById('proyectos').scrollIntoView({behavior:'smooth'});
    setFilter('Todos',n);
  });
}
function renderMenus(){
  $('[data-cats]').innerHTML=`<a href="#proyectos" data-menu-cat="Todos">Todos <small>${PROJECTS.length}</small></a>`+
    CATS.map(c=>`<a href="#proyectos" data-menu-cat="${esc(c)}">${esc(c)} <small>${count(p=>p.category===c)}</small></a>`).join('');
  const years=[...new Set(WORKS.map(w=>w.year))].sort((a,b)=>b-a);
  $('[data-years]').innerHTML=years.map(y=>`<a href="#trabajos-${y}">${y} <small>${WORKS.filter(w=>w.year===y).length}</small></a>`).join('');
  $('[data-cats]').addEventListener('click',e=>{const a=e.target.closest('[data-menu-cat]');if(a)setFilter(a.dataset.menuCat,null)});
}

/* ---------- Navegación ---------- */
const header=$('.site-header'),nav=$('#nav'),burger=$('.burger');
function closeSubs(except){$$('.has-sub').forEach(s=>{if(s!==except){s.classList.remove('open');$('.nav-link',s).setAttribute('aria-expanded','false')}})}
$$('.has-sub>.nav-link').forEach(b=>b.addEventListener('click',()=>{
  const li=b.parentElement,open=!li.classList.contains('open');
  closeSubs(li);li.classList.toggle('open',open);b.setAttribute('aria-expanded',open);
}));
document.addEventListener('click',e=>{if(!e.target.closest('.has-sub'))closeSubs()});
function closeNav(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');closeSubs();document.body.style.overflow=''}
burger.addEventListener('click',()=>{const o=!nav.classList.contains('open');nav.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
nav.addEventListener('click',e=>{if(e.target.closest('a')){closeNav();$('.has-sub:hover')?.blur()}});
let lastY=0;
addEventListener('scroll',()=>{const y=scrollY;header.classList.toggle('hide',y>lastY&&y>200&&!nav.classList.contains('open'));lastY=y},{passive:true});

/* ---------- Visor (con enlaces directos #/proyecto/slug) ---------- */
const lb=$('[data-lb]');let items=[],cur=0,lastFocus,isOpen=false;
function media(it,k){const imgs=it.images?.length?it.images:(it.image?[it.image]:[]);
  return imgs.length?`<img src="${esc(imgs[k]||imgs[0])}" alt="${esc(it.title)}">`:art(it.art.kind,it.art.palette,it.slug||it.title,it.title)}
function show(i,fromHash){
  cur=(i+items.length)%items.length;const it=items[cur];
  lb.classList.remove('show');
  setTimeout(()=>{
    const imgs=it.images?.length?it.images:(it.image?[it.image]:[]);
    $('[data-lb-art]').innerHTML=media(it,0);
    $('[data-lb-thumbs]').innerHTML=imgs.length>1?imgs.map((s,k)=>`<button data-k="${k}" aria-label="Imagen ${k+1}"><img src="${esc(s)}" alt=""></button>`).join(''):'';
    $('[data-lb-meta]').textContent=[it.category,it.year,it.client].join(' · ');
    $('[data-lb-title]').textContent=it.title;
    $('[data-lb-desc]').textContent=it.description||`Pieza puntual de ${it.category.toLowerCase()} realizada para ${it.client}.`;
    $('[data-lb-tags]').innerHTML=(it.tags||[it.category,it.year]).map(t=>`<li>${esc(t)}</li>`).join('');
    lb.classList.add('show');
  },isOpen?260:350);
  if(!fromHash&&it.slug)history.replaceState(null,'',`#/proyecto/${it.slug}`);
}
function openLb(list,i,fromHash){
  items=list;lastFocus=document.activeElement;isOpen=true;
  lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';show(i,fromHash);$('.lb-close').focus({preventScroll:true});
}
function closeLb(){
  if(!isOpen)return;isOpen=false;
  lb.classList.remove('open','show');lb.setAttribute('aria-hidden','true');document.body.style.overflow='';lastFocus?.focus({preventScroll:true});
  if(location.hash.startsWith('#/proyecto/'))history.replaceState(null,'',location.pathname+location.search);
}
function openProject(i){
  const vis=$$('.card',grid).filter(c=>!c.classList.contains('gone')).map(c=>+c.dataset.i);
  openLb(vis.map(n=>PROJECTS[n]),vis.indexOf(i));
}
function openWork(i){openLb(WORKS,i)}
function routeFromHash(){
  const m=location.hash.match(/^#\/proyecto\/(.+)$/);if(!m)return;
  const i=PROJECTS.findIndex(p=>p.slug===m[1]);if(i<0)return;
  openLb(PROJECTS,i,true);
}
grid.addEventListener('click',e=>{const c=e.target.closest('.card');if(c)openProject(+c.dataset.i)});
$('[data-works]').addEventListener('click',e=>{const w=e.target.closest('.work');if(w)openWork(+w.dataset.w)});
$('[data-lb-thumbs]').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b)$('[data-lb-art]').innerHTML=media(items[cur],+b.dataset.k)});
document.addEventListener('keydown',e=>{
  const t=e.target;
  if((e.key==='Enter'||e.key===' ')&&t.matches('.card,.work')){e.preventDefault();t.click()}
  if(!isOpen)return;
  if(e.key==='Escape')closeLb();
  if(e.key==='ArrowRight')show(cur+1);
  if(e.key==='ArrowLeft')show(cur-1);
  if(e.key==='Tab'){ // atrapar el foco dentro del visor
    const f=$$('button',lb).filter(b=>b.offsetParent!==null);if(!f.length)return;
    const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
  }
});
addEventListener('hashchange',()=>{if(location.hash.startsWith('#/proyecto/'))routeFromHash();else closeLb()});
$('.lb-close').addEventListener('click',closeLb);
$('.lb-nav.prev').addEventListener('click',()=>show(cur-1));
$('.lb-nav.next').addEventListener('click',()=>show(cur+1));

/* ---------- Vista previa flotante en Trabajos ---------- */
const peek=$('[data-peek]');let px=0,py=0,tx=0,ty=0,raf=0;
function loop(){px+=(tx-px)*.14;py+=(ty-py)*.14;peek.style.transform=`translate(${px}px,${py}px) rotate(${(tx-px)*.04}deg) scale(1)`;raf=peek.classList.contains('on')?requestAnimationFrame(loop):0}
const worksEl=$('[data-works]');
worksEl.addEventListener('mouseover',e=>{
  const w=e.target.closest('.work');if(!w||!matchMedia('(hover:hover)').matches)return;
  const d=WORKS[+w.dataset.w];peek.innerHTML=visual(d,d.title);
  if(!peek.classList.contains('on')){px=tx;py=ty}
  peek.classList.add('on');if(!raf)raf=requestAnimationFrame(loop);
});
worksEl.addEventListener('mouseout',e=>{if(!e.relatedTarget?.closest?.('.work'))peek.classList.remove('on')});
worksEl.addEventListener('mousemove',e=>{tx=e.clientX+28;ty=e.clientY-150});

/* ---------- Formulario real: POST /api/contact ---------- */
$('[data-form]').addEventListener('submit',async e=>{
  e.preventDefault();
  const f=e.target,ok=$('.form-ok'),btn=$('button',f);
  btn.disabled=true;ok.textContent='Enviando…';
  try{
    const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:f.n.value,email:f.e.value,message:f.m.value,website:f.website.value})});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error||'Error al enviar');
    ok.textContent=`Gracias, ${f.n.value}. Recibí tu mensaje y te respondo pronto.`;f.reset();
  }catch(err){ok.textContent=`No se pudo enviar: ${err.message}. Escríbeme a ${SITE.email}.`}
  btn.disabled=false;
});

/* ---------- Revelado al hacer scroll ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const observeAll=()=>$$('.reveal:not(.in)').forEach(el=>io.observe(el));

/* ---------- Init ---------- */
let H,A;
(async()=>{
  try{
    const r=await fetch('content/site.json',{cache:'no-cache'});
    if(!r.ok)throw new Error(r.status);
    const d=await r.json();
    SITE=d.site;CATS=d.categories;PAL=d.palettes;H=d.hero;A=d.about;
    PROJECTS=d.projects.map(p=>({...p,slug:p.slug||slugOf(p.title)}));
    WORKS=d.works;
  }catch(err){
    document.body.insertAdjacentHTML('afterbegin','<p style="padding:120px 24px;font-family:sans-serif">No se pudo cargar <code>content/site.json</code>. Sirve el sitio con <code>npm start</code> (no abras el archivo directamente).</p>');
    return;
  }
  renderStatic();renderGrid();renderFilters();renderWorks();renderClients();renderMenus();observeAll();routeFromHash();
})();
