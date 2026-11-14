/* ---------- Datos ficticios ---------- */
const CATS = ['Identidad','Editorial','Packaging','Cartelería','Digital'];
const PAL = {
  terracota:['#e9dccb','#c8553d','#1d1d1b','#f2b134'],
  oceano:['#dfe9ea','#12495c','#f26b4f','#f4efe4'],
  oliva:['#eceadb','#5d6b3a','#d9a441','#2a2a24'],
  noche:['#14141a','#f4e9d8','#7b6cf6','#ef5b7b'],
  rosa:['#f5dfe0','#d1405c','#2b2b6b','#fff6ea'],
  mono:['#efefef','#111111','#9a9a9a','#ffffff'],
  cobalto:['#e8ecf6','#2145d6','#f9c80e','#111111'],
  arena:['#efe3cf','#a6603a','#3e2a1f','#f7f1e6']
};
const PROJECTS = [
  {t:'Casa Alba',c:'Identidad',cl:'Casa Alba Hotel',y:2026,k:'logo',p:'terracota',w:1,d:'Sistema de identidad para un hotel boutique en Cartagena: monograma, paleta cálida y señalética.',tags:['Logotipo','Señalética','Papelería']},
  {t:'Marea Viva',c:'Cartelería',cl:'Festival Marea',y:2026,k:'poster',p:'oceano',d:'Serie de carteles para un festival de música costero. Formas simples que se mueven como olas.',tags:['Cartel','Serie','Impresión']},
  {t:'Tierra Baja',c:'Packaging',cl:'Café Tierra',y:2025,k:'pack',p:'arena',d:'Línea de empaques para café de origen: tintas planas sobre kraft y una retícula modular.',tags:['Empaque','Ilustración','Serigrafía']},
  {t:'Revista Umbral',c:'Editorial',cl:'Editorial Umbral',y:2025,k:'editorial',p:'noche',w:1,d:'Dirección de arte y maquetación de una revista trimestral de ensayo y fotografía.',tags:['Maquetación','Tipografía','Dirección de arte']},
  {t:'Olivar',c:'Packaging',cl:'Olivar Aceites',y:2025,k:'pack',p:'oliva',d:'Etiquetas y estuche para aceite de oliva virgen extra, con un sello tipográfico.',tags:['Etiqueta','Estuche']},
  {t:'Pulso',c:'Digital',cl:'Pulso Salud',y:2024,k:'pattern',p:'cobalto',d:'Identidad visual para una app de bienestar: sistema de patrones y microanimaciones.',tags:['UI','Patrones','Motion']},
  {t:'Noches de Jazz',c:'Cartelería',cl:'Teatro Mayor',y:2024,k:'poster',p:'rosa',d:'Afiches de temporada para el ciclo anual de jazz en el Teatro Mayor.',tags:['Cartel','Tipografía']},
  {t:'Atlas de Sal',c:'Editorial',cl:'Editorial Umbral',y:2024,k:'editorial',p:'terracota',d:'Diseño de libro de ensayo fotográfico: portada, interiores y sobrecubierta.',tags:['Libro','Fotografía']},
  {t:'Nodo',c:'Identidad',cl:'Nodo Coworking',y:2023,k:'logo',p:'mono',d:'Marca para un espacio de trabajo compartido, basada en un nodo que se conecta.',tags:['Logotipo','Manual de marca']},
  {t:'Raíz',c:'Digital',cl:'Café Tierra',y:2023,k:'pattern',p:'oliva',d:'Tienda en línea y campaña social para marca de productos locales.',tags:['Web','Redes','Campaña']}
];
const WORKS = [
  [2026,'Tarjeta de temporada','Papelería','Casa Alba Hotel','logo','terracota'],
  [2026,'Cartel “Marea” B1','Cartelería','Festival Marea','poster','oceano'],
  [2026,'Menú de desayunos','Editorial','Casa Alba Hotel','editorial','arena'],
  [2025,'Etiqueta edición limitada','Packaging','Café Tierra','pack','terracota'],
  [2025,'Portada nº 12','Editorial','Editorial Umbral','editorial','noche'],
  [2025,'Kit de redes “Verano”','Digital','Pulso Salud','pattern','cobalto'],
  [2024,'Afiche conferencia','Cartelería','Nodo Coworking','poster','mono'],
  [2024,'Estuche de regalo','Packaging','Olivar Aceites','pack','oliva'],
  [2024,'Isotipo animado','Identidad','Pulso Salud','logo','cobalto'],
  [2023,'Programa de mano','Editorial','Teatro Mayor','editorial','rosa'],
  [2023,'Señalética de sala','Identidad','Nodo Coworking','logo','mono'],
  [2023,'Banner web “Raíz”','Digital','Café Tierra','pattern','oliva']
];

/* ---------- Generador de arte (SVG procedural, reproducible) ---------- */
function rng(seed){let s=seed>>>0||1;return()=>((s=Math.imul(s^s>>>15,2246822507)+1013904223>>>0)/4294967296)}
function hash(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function art(kind,pal,seed,title=''){
  const r=rng(hash(seed)),P=PAL[pal],pick=()=>P[1+Math.floor(r()*3)],W=400,H=500;
  let g='';
  const letter=(title.trim()[0]||'A').toUpperCase();
  if(kind==='poster'){
    const cx=100+r()*200;
    g+=`<circle cx="${cx}" cy="${170+r()*60}" r="${90+r()*40}" fill="${P[1]}"/>`;
    g+=`<rect x="${r()*120}" y="${280+r()*40}" width="${160+r()*160}" height="${30+r()*50}" fill="${P[2]}"/>`;
    g+=`<path d="M0 ${H} L${120+r()*100} ${330+r()*40} L${H} ${H}Z" fill="${P[3]}" opacity=".95"/>`;
    g+=`<circle cx="${60+r()*280}" cy="${60+r()*60}" r="${14+r()*22}" fill="${P[2]}"/>`;
    g+=`<text x="28" y="${H-30}" font-family="Fraunces,serif" font-size="46" fill="${P[0]===PAL.noche[0]?P[3]:P[2]}" letter-spacing="-2">${title.split(' ')[0]}</text>`;
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
const count=(f)=>PROJECTS.filter(f).length;

/* ---------- Render ---------- */
const state={cat:'Todos',client:null};
const grid=$('[data-grid]');

function renderGrid(){
  grid.innerHTML=PROJECTS.map((p,i)=>`
    <article class="card reveal ${p.w?'wide':''}" data-i="${i}" tabindex="0" role="button" aria-label="Abrir ${p.t}" style="--d:${(i%3)*.08}s">
      <div class="card-art">${art(p.k,p.p,p.t,p.t)}</div>
      <div class="card-info"><h3>${p.t}</h3><span>${p.c} · ${p.y}</span></div>
    </article>`).join('');
  $('[data-count]').textContent=`(${PROJECTS.length})`;
}
function renderFilters(){
  const wrap=$('[data-filters]'),all=['Todos',...CATS];
  wrap.innerHTML=all.map(c=>`<button class="chip" role="tab" data-cat="${c}">${c}<small>${c==='Todos'?PROJECTS.length:count(p=>p.c===c)}</small></button>`).join('')
    +`<button class="chip on" data-clear hidden></button>`;
  const clr=$('[data-clear]',wrap);
  clr.addEventListener('click',()=>setFilter('Todos',null));
  wrap.addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(b)setFilter(b.dataset.cat,null)});
}
function setFilter(cat,client){
  state.cat=cat;state.client=client;
  $$('[data-cat]',$('[data-filters]')).forEach(b=>{const on=!client&&b.dataset.cat===cat;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  const clr=$('[data-clear]');clr.hidden=!client;if(client)clr.textContent=`Cliente: ${client} ✕`;
  const cards=$$('.card',grid);
  // salida suave → reflujo → entrada
  cards.forEach(c=>c.classList.add('hidden'));
  setTimeout(()=>{
    let n=0;
    cards.forEach((c,i)=>{
      const p=PROJECTS[i],ok=(cat==='Todos'||p.c===cat)&&(!client||p.cl===client);
      c.classList.toggle('gone',!ok);
      if(ok){n++;requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.transitionDelay=`${n*.05}s`;c.classList.remove('hidden');c.classList.add('in')}))}
    });
    grid.querySelector('.empty')?.remove();
    if(!n)grid.insertAdjacentHTML('beforeend','<p class="empty">Sin proyectos en esta selección.</p>');
  },320);
}
function renderWorks(){
  const years=[...new Set(WORKS.map(w=>w[0]))];
  $('[data-works]').innerHTML=years.map(y=>`
    <div class="year reveal" id="trabajos-${y}"><h3>${y}</h3><div>
      ${WORKS.map((w,i)=>w[0]===y?`<div class="work" data-w="${i}" tabindex="0" role="button">
        <b>${w[1]}</b><span>${w[2]}</span><span>${w[3]}</span><i>↗</i></div>`:'').join('')}
    </div></div>`).join('');
  $('[data-wcount]').textContent=`(${WORKS.length})`;
}
function renderClients(){
  const names=[...new Set([...PROJECTS.map(p=>p.cl),...WORKS.map(w=>w[3])])];
  $('[data-clients]').innerHTML=names.map(n=>{
    const c=count(p=>p.cl===n);
    return `<li class="client reveal"><button data-client="${n}"><b>${n}</b><small>${c?c+' proyecto'+(c>1?'s':''):'Trabajos puntuales'}</small></button></li>`}).join('');
  $('[data-ccount]').textContent=`(${names.length})`;
  $('[data-clients]').addEventListener('click',e=>{
    const b=e.target.closest('[data-client]');if(!b)return;
    const n=b.dataset.client;
    if(!count(p=>p.cl===n)){const i=WORKS.findIndex(w=>w[3]===n);openWork(i);return}
    document.getElementById('proyectos').scrollIntoView({behavior:'smooth'});
    setFilter('Todos',n);
  });
}
function renderMenus(){
  $('[data-cats]').innerHTML=`<a href="#proyectos" data-menu-cat="Todos">Todos <small>${PROJECTS.length}</small></a>`+
    CATS.map(c=>`<a href="#proyectos" data-menu-cat="${c}">${c} <small>${count(p=>p.c===c)}</small></a>`).join('');
  const years=[...new Set(WORKS.map(w=>w[0]))];
  $('[data-years]').innerHTML=years.map(y=>`<a href="#trabajos-${y}">${y} <small>${WORKS.filter(w=>w[0]===y).length}</small></a>`).join('');
  $('[data-cats]').addEventListener('click',e=>{const a=e.target.closest('[data-menu-cat]');if(a)setFilter(a.dataset.menuCat,null)});
  $('[data-portrait]').innerHTML=art('pattern','terracota','retrato','Daniel');
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

/* ---------- Visor ---------- */
const lb=$('[data-lb]');let items=[],cur=0,lastFocus;
function show(i){
  cur=(i+items.length)%items.length;const it=items[cur];
  lb.classList.remove('show');
  setTimeout(()=>{
    $('[data-lb-art]').innerHTML=art(it.k,it.p,it.seed,it.t);
    $('[data-lb-meta]').textContent=`${it.c} · ${it.y} · ${it.cl}`;
    $('[data-lb-title]').textContent=it.t;
    $('[data-lb-desc]').textContent=it.d;
    $('[data-lb-tags]').innerHTML=it.tags.map(t=>`<li>${t}</li>`).join('');
    lb.classList.add('show');
  },lb.classList.contains('open')?260:350);
}
function openLb(list,i){
  items=list;lastFocus=document.activeElement;
  lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';show(i);$('.lb-close').focus({preventScroll:true});
}
function closeLb(){lb.classList.remove('open','show');lb.setAttribute('aria-hidden','true');document.body.style.overflow='';lastFocus?.focus({preventScroll:true})}
const projItems=()=>PROJECTS.map(p=>({...p,seed:p.t}));
function openProject(i){
  const vis=$$('.card',grid).filter(c=>!c.classList.contains('gone')).map(c=>+c.dataset.i);
  const list=vis.map(n=>projItems()[n]);openLb(list,vis.indexOf(i));
}
function openWork(i){
  const list=WORKS.map(w=>({t:w[1],c:w[2],y:w[0],cl:w[3],k:w[4],p:w[5],seed:w[1],d:`Pieza puntual de ${w[2].toLowerCase()} realizada para ${w[3]}.`,tags:[w[2],String(w[0])]}));
  openLb(list,i);
}
grid.addEventListener('click',e=>{const c=e.target.closest('.card');if(c)openProject(+c.dataset.i)});
$('[data-works]').addEventListener('click',e=>{const w=e.target.closest('.work');if(w)openWork(+w.dataset.w)});
document.addEventListener('keydown',e=>{
  const t=e.target;
  if((e.key==='Enter'||e.key===' ')&&(t.matches('.card,.work'))){e.preventDefault();t.click()}
  if(!lb.classList.contains('open'))return;
  if(e.key==='Escape')closeLb();
  if(e.key==='ArrowRight')show(cur+1);
  if(e.key==='ArrowLeft')show(cur-1);
});
$('.lb-close').addEventListener('click',closeLb);
$('.lb-nav.prev').addEventListener('click',()=>show(cur-1));
$('.lb-nav.next').addEventListener('click',()=>show(cur+1));

/* ---------- Vista previa flotante en Trabajos ---------- */
const peek=$('[data-peek]');let px=0,py=0,tx=0,ty=0,raf=0;
function loop(){px+=(tx-px)*.14;py+=(ty-py)*.14;peek.style.transform=`translate(${px}px,${py}px) rotate(${(tx-px)*.04}deg) scale(1)`;raf=peek.classList.contains('on')?requestAnimationFrame(loop):0}
const worksEl=$('[data-works]');
worksEl.addEventListener('mouseover',e=>{
  const w=e.target.closest('.work');if(!w||!matchMedia('(hover:hover)').matches)return;
  const d=WORKS[+w.dataset.w];peek.innerHTML=art(d[4],d[5],d[1],d[1]);
  if(!peek.classList.contains('on')){px=tx;py=ty}
  peek.classList.add('on');if(!raf)raf=requestAnimationFrame(loop);
});
worksEl.addEventListener('mouseout',e=>{if(!e.relatedTarget?.closest?.('.work'))peek.classList.remove('on')});
worksEl.addEventListener('mousemove',e=>{tx=e.clientX+28;ty=e.clientY-150});

/* ---------- Revelado al hacer scroll ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const observeAll=()=>$$('.reveal:not(.in)').forEach(el=>io.observe(el));

/* ---------- Formulario (simulado) ---------- */
$('[data-form]').addEventListener('submit',e=>{
  e.preventDefault();$('.form-ok').textContent=`Gracias, ${e.target.n.value}. Respondo en 48 h (demo: no se envió nada).`;e.target.reset();
});

/* ---------- Init ---------- */
renderGrid();renderFilters();renderWorks();renderClients();renderMenus();observeAll();
