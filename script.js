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
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const count=f=>PROJECTS.filter(f).length;

/* ---------- i18n ----------
   content/site.json         → datos neutrales (slugs, años, clientes, imágenes, idiomas disponibles)
   content/i18n/<código>.json → textos de cada idioma; lo que falte cae al idioma por defecto */
let LANGS=[],DEFAULT_LANG='es',LANG='es',LOC={},BASE={},PORTRAIT=null;
const localeCache={};
const merge=(a,b)=>{
  if(b===undefined||b===null)return a;
  if(Array.isArray(b)||typeof b!=='object'||typeof a!=='object'||a===null||Array.isArray(a))return b;
  const o={...a};for(const k in b)o[k]=merge(a[k],b[k]);return o;
};
async function loadLocale(code){
  if(localeCache[code])return localeCache[code];
  const r=await fetch(`content/i18n/${code}.json`,{cache:'no-cache'});
  if(!r.ok)throw new Error(`${code}: ${r.status}`);
  return localeCache[code]=await r.json();
}
const t=(k,v={})=>String(LOC.ui?.[k]??k).replace(/\{(\w+)\}/g,(_,n)=>v[n]??'');
const tp=(k,n,v={})=>{const f=`${k}.${new Intl.PluralRules(LANG).select(n)}`;return t(LOC.ui?.[f]!==undefined?f:`${k}.other`,{n,...v})};
const catLabel=id=>LOC.categories?.[id]??id;
// Texto localizado de un proyecto (con slug) o de un trabajo (con id)
const info=o=>{
  const l=(o.slug?LOC.projects?.[o.slug]:LOC.works?.[o.id])||{};
  return {title:l.title??o.title??o.id,description:l.description??'',tags:l.tags??null};
};
const visual=(o)=>{const i=info(o);
  return o.image?`<img src="${esc(o.image)}" alt="${esc(i.title)}" loading="lazy" decoding="async">`:art(o.art.kind,o.art.palette,o.slug||o.id,i.title)};

function detectLang(){
  const lc=c=>String(c||'').toLowerCase(),codes=LANGS.map(l=>l.code);
  const pick=c=>{if(!c)return null;const x=lc(c);return codes.find(k=>lc(k)===x)||codes.find(k=>lc(k).split('-')[0]===x.split('-')[0])||null};
  const q=pick(new URLSearchParams(location.search).get('lang'));if(q)return q;       // 1. ?lang=en (enlace compartible)
  try{const s=pick(localStorage.getItem('lang'));if(s)return s}catch{}                // 2. elección guardada
  for(const n of navigator.languages||[navigator.language]){const p=pick(n);if(p)return p} // 3. idioma del navegador
  return DEFAULT_LANG;
}

/* ---------- Render ---------- */
const state={cat:'all',client:null};
const grid=$('[data-grid]');

function renderStatic(first){
  const S=LOC.site,H=LOC.hero,A=LOC.about;
  $$('[data-name]').forEach(e=>e.textContent=SITE.name);
  $('[data-hero-eyebrow]').textContent=`${H.eyebrow} · ${S.location} — ${S.availability}`;
  const ht=$('[data-hero-title]');ht.innerHTML=H.lines.map(l=>`<span class="line"><span>${l}</span></span>`).join(' ');
  ht.classList.toggle('static',!first); // al cambiar de idioma no se repite la animación de entrada
  $('[data-hero-intro]').textContent=H.intro;
  $('[data-lead]').textContent=A.lead;$('[data-about-text]').textContent=A.text;
  $('[data-stats]').innerHTML=A.stats.map(s=>`<div><dt>${esc(s.n)}</dt><dd>${esc(s.l)}</dd></div>`).join('');
  $('[data-process]').innerHTML=A.process.map((p,i)=>`<li><span>0${i+1}</span><b>${esc(p.t)}</b><p>${esc(p.d)}</p></li>`).join('');
  $('[data-awards]').innerHTML=A.awards.map(a=>`<li><span>${esc(a.y)}</span>${esc(a.t)}</li>`).join('');
  const m=$('[data-mail]');m.href=`mailto:${SITE.email}`;m.textContent=SITE.email;
  $('[data-address]').innerHTML=esc(S.address).replace(', ','<br>');
  $('[data-social]').innerHTML=SITE.social.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('<br>');
  $('[data-footer]').textContent=t('footer.copy',{year:new Date().getFullYear(),name:SITE.name});
  $('[data-portrait]').innerHTML=PORTRAIT?`<img src="${esc(PORTRAIT)}" alt="${esc(SITE.name)}">`:art('pattern',Object.keys(PAL)[0],'retrato',SITE.name);
}
function renderGrid(){
  grid.innerHTML=PROJECTS.map((p,i)=>`
    <article class="card reveal ${p.featured?'wide':''}" data-i="${i}" tabindex="0" role="button" aria-label="${esc(t('projects.open',{title:info(p).title}))}" style="--d:${(i%3)*.08}s">
      <div class="card-art">${visual(p)}</div>
      <div class="card-info"><h3>${esc(info(p).title)}</h3><span>${esc(catLabel(p.category))} · ${p.year}</span></div>
    </article>`).join('');
  $('[data-count]').textContent=`(${PROJECTS.length})`;
}
function renderFilters(){
  const wrap=$('[data-filters]');
  wrap.innerHTML=['all',...CATS].map(c=>`<button class="chip" role="tab" data-cat="${esc(c)}">${esc(c==='all'?t('projects.all'):catLabel(c))}<small>${c==='all'?PROJECTS.length:count(p=>p.category===c)}</small></button>`).join('')
    +`<button class="chip on" data-clear hidden></button>`;
}
function applyFilter(instant){
  const {cat,client}=state;
  $$('[data-cat]',$('[data-filters]')).forEach(b=>{const on=!client&&b.dataset.cat===cat;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  const clr=$('[data-clear]');clr.hidden=!client;if(client)clr.textContent=t('filter.client',{name:client});
  const cards=$$('.card',grid);
  if(!instant)cards.forEach(c=>c.classList.add('hidden'));
  setTimeout(()=>{
    let n=0;
    cards.forEach((c,i)=>{
      const p=PROJECTS[i],ok=(cat==='all'||p.category===cat)&&(!client||p.client===client);
      c.classList.toggle('gone',!ok);
      if(ok){n++;requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.transitionDelay=`${n*.05}s`;c.classList.remove('hidden')}))}
    });
    grid.querySelector('.empty')?.remove();
    if(!n)grid.insertAdjacentHTML('beforeend',`<p class="empty">${esc(t('projects.empty'))}</p>`);
  },instant?0:320);
}
function setFilter(cat,client){state.cat=cat;state.client=client;applyFilter(false)}
const yearsDesc=()=>[...new Set(WORKS.map(w=>w.year))].sort((a,b)=>b-a);
function renderWorks(){
  $('[data-works]').innerHTML=yearsDesc().map(y=>`
    <div class="year reveal" id="trabajos-${y}"><h3>${y}</h3><div>
      ${WORKS.map((w,i)=>w.year===y?`<div class="work" data-w="${i}" tabindex="0" role="button" aria-label="${esc(t('works.open',{title:info(w).title}))}">
        <b>${esc(info(w).title)}</b><span>${esc(catLabel(w.category))}</span><span>${esc(w.client)}</span><i>↗</i></div>`:'').join('')}
    </div></div>`).join('');
  $('[data-wcount]').textContent=`(${WORKS.length})`;
}
function renderClients(){
  const names=[...new Set([...PROJECTS.map(p=>p.client),...WORKS.map(w=>w.client)])];
  $('[data-clients]').innerHTML=names.map(n=>{
    const c=count(p=>p.client===n);
    return `<li class="client reveal"><button data-client="${esc(n)}"><b>${esc(n)}</b><small>${esc(c?tp('clients.projects',c):t('clients.misc'))}</small></button></li>`}).join('');
  $('[data-ccount]').textContent=`(${names.length})`;
}
function renderMenus(){
  $('[data-cats]').innerHTML=`<a href="#proyectos" data-menu-cat="all">${esc(t('projects.all'))} <small>${PROJECTS.length}</small></a>`+
    CATS.map(c=>`<a href="#proyectos" data-menu-cat="${esc(c)}">${esc(catLabel(c))} <small>${count(p=>p.category===c)}</small></a>`).join('');
  $('[data-years]').innerHTML=yearsDesc().map(y=>`<a href="#trabajos-${y}">${y} <small>${WORKS.filter(w=>w.year===y).length}</small></a>`).join('');
}

/* ---------- Selector de idioma ---------- */
const langBox=$('[data-lang-switch]');
function renderLangSwitch(){
  langBox.style.setProperty('--n',LANGS.length);
  langBox.innerHTML='<i class="lang-pill" aria-hidden="true"></i>'+LANGS.map(l=>
    `<button type="button" data-lang="${esc(l.code)}" lang="${esc(l.code)}" title="${esc(l.label)}" aria-pressed="false">${esc(l.short)}</button>`).join('');
}
function updateLangUI(){
  const i=Math.max(0,LANGS.findIndex(l=>l.code===LANG));
  langBox.style.setProperty('--i',i);
  $$('button',langBox).forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===LANG));
}
let switching=false;
async function setLang(code,first){
  if(!first&&(code===LANG||switching))return;
  switching=true;
  try{
    const loc=await loadLocale(code);
    if(!first){document.body.classList.add('switching');await sleep(220)}
    LANG=code;LOC=merge(BASE,loc);
    applyLang(first);
    if(!first){
      try{localStorage.setItem('lang',code)}catch{}
      const u=new URL(location.href);u.searchParams.set('lang',code);history.replaceState(null,'',u);
      $('[data-lang-status]').textContent=t('lang.changed',{name:LANGS.find(l=>l.code===code).label});
    }
  }catch(err){console.error('No se pudo cambiar de idioma',err)}
  finally{switching=false;document.body.classList.remove('switching')}
}
function applyLang(first){
  document.documentElement.lang=LANG;
  document.title=LOC.site.title;
  $('meta[name=description]')?.setAttribute('content',LOC.site.description);
  $('meta[property="og:title"]')?.setAttribute('content',LOC.site.title);
  $$('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
  $$('[data-i18n-attr]').forEach(e=>e.dataset.i18nAttr.split(';').forEach(p=>{const[a,k]=p.split(':');e.setAttribute(a,t(k))}));
  burger.setAttribute('aria-label',t(nav.classList.contains('open')?'nav.close':'nav.open'));
  renderStatic(first);renderGrid();renderFilters();renderWorks();renderClients();renderMenus();
  applyFilter(true);updateLangUI();
  if(isOpen)fillLb(items[cur]);
  if(!first)$$('.reveal').forEach(e=>e.classList.add('in')); // lo ya renderizado aparece sin esperar al scroll
  observeAll();
}

/* ---------- Navegación ---------- */
const header=$('.site-header'),nav=$('#nav'),burger=$('.burger');
function closeSubs(except){$$('.has-sub').forEach(s=>{if(s!==except){s.classList.remove('open');$('.nav-link',s).setAttribute('aria-expanded','false')}})}
$$('.has-sub>.nav-link').forEach(b=>b.addEventListener('click',()=>{
  const li=b.parentElement,open=!li.classList.contains('open');
  closeSubs(li);li.classList.toggle('open',open);b.setAttribute('aria-expanded',open);
}));
document.addEventListener('click',e=>{if(!e.target.closest('.has-sub'))closeSubs()});
function setNav(open){nav.classList.toggle('open',open);burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',t(open?'nav.close':'nav.open'));document.body.style.overflow=open?'hidden':''}
function closeNav(){setNav(false);closeSubs()}
burger.addEventListener('click',()=>setNav(!nav.classList.contains('open')));
nav.addEventListener('click',e=>{if(e.target.closest('a')){closeNav();$('.has-sub:hover')?.blur()}});
// La cabecera (menú + selector de idioma) permanece siempre visible; solo gana una línea al hacer scroll
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>8),{passive:true});

/* ---------- Visor (con enlaces directos #/proyecto/slug) ---------- */
const lb=$('[data-lb]');let items=[],cur=0,lastFocus,isOpen=false;
const imgsOf=it=>it.images?.length?it.images:(it.image?[it.image]:[]);
function media(it,k){const imgs=imgsOf(it);
  return imgs.length?`<img src="${esc(imgs[k]||imgs[0])}" alt="${esc(info(it).title)}">`:art(it.art.kind,it.art.palette,it.slug||it.id,info(it).title)}
function fillLb(it){
  const i=info(it),imgs=imgsOf(it),cat=catLabel(it.category);
  $('[data-lb-art]').innerHTML=media(it,0);
  $('[data-lb-thumbs]').innerHTML=imgs.length>1?imgs.map((s,k)=>`<button data-k="${k}" aria-label="${esc(t('lb.image',{n:k+1}))}"><img src="${esc(s)}" alt=""></button>`).join(''):'';
  $('[data-lb-meta]').textContent=[cat,it.year,it.client].join(' · ');
  $('[data-lb-title]').textContent=i.title;
  $('[data-lb-desc]').textContent=i.description||t('lb.workDesc',{category:cat,client:it.client});
  $('[data-lb-tags]').innerHTML=(i.tags||[cat,it.year]).map(x=>`<li>${esc(x)}</li>`).join('');
}
function show(i,fromHash){
  cur=(i+items.length)%items.length;const it=items[cur];
  lb.classList.remove('show');
  setTimeout(()=>{fillLb(it);lb.classList.add('show')},isOpen?260:350);
  if(!fromHash&&it.slug)history.replaceState(null,'',`${location.pathname}${location.search}#/proyecto/${it.slug}`);
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
  const tg=e.target;
  if((e.key==='Enter'||e.key===' ')&&tg.matches('.card,.work')){e.preventDefault();tg.click()}
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
// Gestos táctiles: deslizar para cambiar de proyecto
let sx=0,sy=0;
lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
lb.addEventListener('touchend',e=>{
  if(!isOpen)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
  if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)show(cur+(dx<0?1:-1));
},{passive:true});
$('.lb-close').addEventListener('click',closeLb);
$('.lb-nav.prev').addEventListener('click',()=>show(cur-1));
$('.lb-nav.next').addEventListener('click',()=>show(cur+1));

/* ---------- Vista previa flotante en Trabajos ---------- */
const peek=$('[data-peek]');let px=0,py=0,tx=0,ty=0,raf=0;
function loop(){px+=(tx-px)*.14;py+=(ty-py)*.14;peek.style.transform=`translate(${px}px,${py}px) rotate(${(tx-px)*.04}deg) scale(1)`;raf=peek.classList.contains('on')?requestAnimationFrame(loop):0}
const worksEl=$('[data-works]');
worksEl.addEventListener('mouseover',e=>{
  const w=e.target.closest('.work');if(!w||!matchMedia('(hover:hover)').matches)return;
  peek.innerHTML=visual(WORKS[+w.dataset.w]);
  if(!peek.classList.contains('on')){px=tx;py=ty}
  peek.classList.add('on');if(!raf)raf=requestAnimationFrame(loop);
});
worksEl.addEventListener('mouseout',e=>{if(!e.relatedTarget?.closest?.('.work'))peek.classList.remove('on')});
worksEl.addEventListener('mousemove',e=>{tx=e.clientX+28;ty=e.clientY-150});

/* ---------- Formulario: POST (api/contact o webhook) ---------- */
$('[data-form]').addEventListener('submit',async e=>{
  e.preventDefault();
  const f=e.target,ok=$('.form-ok'),btn=$('button',f);
  btn.disabled=true;ok.textContent=t('form.sending');
  try{
    const r=await fetch(SITE.contactEndpoint||'api/contact',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:f.n.value,email:f.e.value,message:f.m.value,website:f.website.value,lang:LANG})});
    if([404,405,501].includes(r.status)){ // hosting estático (GitHub Pages): sin backend → abre el correo
      const q=new URLSearchParams({subject:t('form.subject',{name:f.n.value}),body:`${f.m.value}\n\n${f.n.value} <${f.e.value}>`});
      location.href=`mailto:${SITE.email}?${q.toString().replace(/\+/g,'%20')}`;
      ok.textContent=t('form.mailto');btn.disabled=false;return;
    }
    const j=await r.json().catch(()=>({}));
    if(!r.ok){const k=`err.${j.code}`;throw new Error(LOC.ui?.[k]?t(k):t('err.generic'))}
    ok.textContent=t('form.ok',{name:f.n.value});f.reset();
  }catch(err){ok.textContent=t('form.fail',{error:err instanceof TypeError?t('err.network'):err.message,email:SITE.email})}
  btn.disabled=false;
});

/* ---------- Revelado al hacer scroll ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const observeAll=()=>$$('.reveal:not(.in)').forEach(el=>io.observe(el));

/* ---------- Eventos delegados (se registran una sola vez) ---------- */
$('[data-filters]').addEventListener('click',e=>{
  if(e.target.closest('[data-clear]'))return setFilter('all',null);
  const b=e.target.closest('[data-cat]');if(b)setFilter(b.dataset.cat,null);
});
$('[data-cats]').addEventListener('click',e=>{const a=e.target.closest('[data-menu-cat]');if(a)setFilter(a.dataset.menuCat,null)});
$('[data-clients]').addEventListener('click',e=>{
  const b=e.target.closest('[data-client]');if(!b)return;
  const n=b.dataset.client;
  if(!count(p=>p.client===n)){openWork(WORKS.findIndex(w=>w.client===n));return}
  document.getElementById('proyectos').scrollIntoView({behavior:'smooth'});
  setFilter('all',n);
});
langBox.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(b)setLang(b.dataset.lang)});
langBox.addEventListener('keydown',e=>{ // flechas ← → entre idiomas
  if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
  const bs=$$('button',langBox),i=bs.indexOf(document.activeElement);if(i<0)return;
  e.preventDefault();bs[(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length].focus();
});

/* ---------- Init ---------- */
(async()=>{
  try{
    const r=await fetch('content/site.json',{cache:'no-cache'});
    if(!r.ok)throw new Error(r.status);
    const d=await r.json();
    SITE=d.site;LANGS=d.languages;DEFAULT_LANG=d.defaultLanguage||LANGS[0].code;CATS=d.categories;PAL=d.palettes;
    PORTRAIT=d.about?.portrait||null;PROJECTS=d.projects;WORKS=d.works;
    BASE=await loadLocale(DEFAULT_LANG);
    LANG=detectLang();
    LOC=merge(BASE,LANG===DEFAULT_LANG?BASE:await loadLocale(LANG));
  }catch(err){
    document.body.insertAdjacentHTML('afterbegin','<p style="padding:120px 24px;font-family:sans-serif">No se pudo cargar el contenido (<code>content/</code>). Sirve el sitio con <code>npm start</code> (no abras el archivo directamente).</p>');
    console.error(err);return;
  }
  renderLangSwitch();
  applyLang(true);routeFromHash();
})();
