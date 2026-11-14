# Portafolio — Diseño gráfico

Sitio de portafolio minimalista, sin dependencias ni paso de build. El contenido vive en `content/site.json` y `content/i18n/*.json` y un servidor Node de ~100 líneas sirve el sitio y recibe el formulario de contacto.

## Arrancar

```bash
npm start                      # http://localhost:3000
PORT=8080 npm start            # otro puerto
npm run validate               # revisa site.json, traducciones e imágenes antes de publicar
npm run check:responsive       # 13 tamaños (320→2560, vertical y horizontal); requiere Playwright local
```

Requiere Node ≥ 18. No abras `index.html` con doble clic: necesita el servidor para cargar `content/site.json` y para el formulario.

## Idiomas (español · inglés · francés canadiense)

El sitio es multilingüe: **ES / EN / FR (fr-CA)**. El selector está en la cabecera, siempre visible en escritorio y móvil, y cambia el idioma al instante, sin recargar, conservando el filtro activo y el proyecto abierto.

**Qué idioma se muestra** (en este orden): 1) `?lang=en` en la URL (enlace compartible), 2) la elección guardada del visitante, 3) el idioma del navegador (`fr-FR` → fr-CA, `en-GB` → en…), 4) el idioma por defecto (`defaultLanguage`). Se actualizan `<html lang>`, el título y la descripción.

**Cómo está organizado el contenido**

| Archivo | Contiene |
|---|---|
| `content/site.json` | Datos que **no** cambian entre idiomas: slugs, años, clientes, imágenes, ids de categoría, lista de idiomas, correo, redes |
| `content/i18n/<código>.json` | Todo el texto de un idioma: interfaz (`ui`), hero, "Acerca de", etiquetas de categoría, y descripción/etiquetas de cada proyecto y título de cada trabajo |

Lo que falte en un idioma cae automáticamente al idioma por defecto, y `npm run validate` **falla** si a algún idioma le faltan claves, proyectos o trabajos.

**Añadir otro idioma** (p. ej. portugués):

1. Copia `content/i18n/es.json` a `content/i18n/pt.json` y traduce los valores (no cambies las claves).
2. Añádelo en `languages` de `content/site.json`: `{ "code": "pt", "short": "PT", "label": "Português" }`.
3. `npm run validate`. El selector crece solo.

## Editar contenido

**Añadir un proyecto**

1. En `content/site.json` → `projects` (copia uno existente):

```json
{
  "slug": "mi-proyecto",            // único; define el enlace directo #/proyecto/mi-proyecto
  "title": "Mi proyecto",           // nombre de marca (igual en todos los idiomas; ver abajo si quieres traducirlo)
  "category": "identity",           // id: debe existir en "categories"
  "client": "Cliente S.A.",
  "year": 2026,
  "featured": false,                // true = tarjeta ancha
  "image": "assets/projects/mi-proyecto/portada.jpg",
  "images": ["assets/projects/mi-proyecto/1.jpg", "assets/projects/mi-proyecto/2.jpg"],
  "art": { "kind": "logo", "palette": "terracota" }   // respaldo si no hay imagen
}
```

2. En **cada** `content/i18n/*.json` → `projects`, con el mismo slug:

```json
"mi-proyecto": { "description": "Texto del caso.", "tags": ["Logotipo", "Papelería"], "title": "Opcional: título traducido" }
```

- **Imágenes reales:** súbelas a `assets/projects/` y apunta `image` (portada) e `images` (galería del visor). Si `image` es `null`, se usa el arte generado de `art`. Recomendado: portada 4:5 (p. ej. 1200×1500) en WebP/AVIF/JPG.
- **Trabajos** (`works`): igual, con un `id` único; su `title` va en `works.<id>` de cada idioma. Se agrupan solos por año.
- **Categorías nuevas:** añade el **id** a `categories` y su etiqueta en `categories` de cada idioma; menús y filtros se actualizan solos.
- Tras editar: `npm run validate`.

## Formulario de contacto

`POST /api/contact` valida los datos (honeypot anti-bot, límite de 5 envíos/hora por IP, cuerpo máx. 10 KB) y:

1. Guarda cada mensaje en `data/messages.jsonl` (una línea JSON por mensaje; carpeta fuera de git y no servida por HTTP).
2. Si defines `CONTACT_WEBHOOK`, reenvía el mensaje a esa URL (p. ej. un webhook de **n8n** que te mande correo, Telegram, etc.). Si el webhook falla, el mensaje ya está guardado.

```bash
CONTACT_WEBHOOK=https://n8n.tu-dominio/webhook/contacto npm start
tail -n 5 data/messages.jsonl
```

Detrás de nginx/Traefik/Caddy usa `TRUST_PROXY=1` para que el límite use la IP real (`X-Forwarded-For`). **No lo actives si el servidor está expuesto directamente**, porque la cabecera sería falsificable.

## Publicar en GitHub Pages

El flujo `.github/workflows/pages.yml` valida el contenido en cada PR y publica en Pages al hacer push a `main`. Ajuste único (una vez): **Settings → Pages → Source: GitHub Actions**.

URL resultante: `https://<usuario>.github.io/website-portafolio-daniel/` (todas las rutas del sitio son relativas, funciona bajo subruta).

Pages es estático: no existe `/api/contact`. El formulario tiene dos modos:

1. **Sin configurar (por defecto):** abre la app de correo con el mensaje prellenado hacia `site.email`.
2. **Con webhook (recomendado):** en `content/site.json` pon `"contactEndpoint": "https://tu-n8n/webhook/contacto"`. El formulario hará POST JSON `{name,email,message,website,lang}` (`lang` = idioma desde el que escribió: `es`, `en` o `fr-CA`, útil para responderle en el mismo). En el nodo Webhook de n8n activa **Allowed Origins (CORS)** con `https://<usuario>.github.io` y descarta peticiones con `website` no vacío (honeypot). Ten en cuenta que esa URL es pública: añade tu propia validación/límite en n8n.

El servidor Node (`server.js`) solo hace falta si lo alojas tú mismo (siguiente sección).

## Despliegue (Docker, self-hosted)

```bash
docker build -t portafolio .
docker run -d --name portafolio -p 3000:3000 \
  -v portafolio-data:/app/data \
  -e TRUST_PROXY=1 -e CONTACT_WEBHOOK=https://... \
  portafolio
```

Pon HTTPS delante (Caddy/Traefik/nginx). El volumen `data` conserva los mensajes. Nota: la imagen corre como usuario `node`; si montas una carpeta del host en `/app/data`, dale permisos de escritura a UID 1000.

## Responsive

Diseñado mobile-first en la práctica: sin scroll horizontal de 320 px a 2560+ px, vertical y horizontal.

- **Menú:** desplegables al pasar el cursor/foco en escritorio; panel a pantalla completa con acordeones en ≤900 px. La cabecera (menú + selector de idioma) está siempre visible.
- **Visor:** pieza dimensionada con `dvh` (respeta las barras del navegador móvil); controles en barra superior en móvil; en teléfono horizontal, pieza a la izquierda y texto con scroll a la derecha; gesto de deslizar para cambiar de proyecto.
- **Táctil:** zonas de toque ≥44 px, campos a 16 px (iOS no hace zoom), sin efectos hover "pegados".
- **Pantallas con notch** (`viewport-fit=cover`, `env(safe-area-*)`) y **ultra-anchas** (contenido limitado a 1680 px).
- Respeta `prefers-reduced-motion`.
- Tras cambiar CSS, ejecuta `npm run check:responsive`.

## Estructura

```
index.html        estructura y marcado
styles.css        diseño, transiciones y responsive
script.js         render desde JSON, filtros, visor, formulario
server.js         estático (lista blanca de rutas) + /api/contact
content/site.json  datos neutrales (proyectos, trabajos, idiomas)
content/i18n/     textos por idioma (es, en, fr-CA)
assets/           tus imágenes
scripts/validate.js        valida contenido e imágenes
scripts/check-responsive.js  regresión de responsive
data/             mensajes recibidos (ignorado por git)
```

## Ideas para seguir mejorando

- Panel de administración sencillo (login + edición de `site.json` y subida de imágenes).
- Pipeline de imágenes (redimensionado y WebP/AVIF automático, `srcset`).
- Página propia por proyecto (SEO, Open Graph por proyecto) en lugar del visor.
- Prerenderizar una página estática por idioma (`/en/`, `/fr-CA/`) con `hreflang` para SEO multilingüe: hoy el contenido se pinta en el navegador y los buscadores ven el idioma por defecto.
- Analítica self-hosted (Plausible/Umami) y feed RSS de novedades.
- Notificación del formulario por correo directo (SMTP) además del webhook.
