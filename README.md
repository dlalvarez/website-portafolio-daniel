# Portafolio — Diseño gráfico

Sitio de portafolio minimalista, sin dependencias ni paso de build. Todo el contenido vive en un solo archivo (`content/site.json`) y un servidor Node de ~100 líneas sirve el sitio y recibe el formulario de contacto.

## Arrancar

```bash
npm start                      # http://localhost:3000
PORT=8080 npm start            # otro puerto
npm run validate               # revisa site.json e imágenes antes de publicar
```

Requiere Node ≥ 18. No abras `index.html` con doble clic: necesita el servidor para cargar `content/site.json` y para el formulario.

## Editar contenido

Todo está en `content/site.json`: datos del sitio, hero, "Acerca de", categorías, proyectos, trabajos y clientes (los clientes se derivan de proyectos y trabajos).

**Añadir un proyecto** (copia uno existente en `projects`):

```json
{
  "slug": "mi-proyecto",            // único; define el enlace directo #/proyecto/mi-proyecto
  "title": "Mi proyecto",
  "category": "Identidad",          // debe existir en "categories"
  "client": "Cliente S.A.",
  "year": 2026,
  "description": "Texto del caso.",
  "tags": ["Logotipo", "Papelería"],
  "featured": false,                // true = tarjeta ancha
  "image": "assets/projects/mi-proyecto/portada.jpg",
  "images": ["assets/projects/mi-proyecto/1.jpg", "assets/projects/mi-proyecto/2.jpg"],
  "art": { "kind": "logo", "palette": "terracota" }   // respaldo si no hay imagen
}
```

- **Imágenes reales:** súbelas a `assets/projects/` y apunta `image` (portada) e `images` (galería del visor). Si `image` es `null`, se usa el arte generado de `art`. Recomendado: portada 4:5 (p. ej. 1200×1500) en WebP/AVIF/JPG.
- **Trabajos** (`works`): igual, con `image` opcional. Se agrupan solos por año.
- **Categorías nuevas:** añádelas a `categories`; los menús y filtros se actualizan solos.
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

## Despliegue (Docker, self-hosted)

```bash
docker build -t portafolio .
docker run -d --name portafolio -p 3000:3000 \
  -v portafolio-data:/app/data \
  -e TRUST_PROXY=1 -e CONTACT_WEBHOOK=https://... \
  portafolio
```

Pon HTTPS delante (Caddy/Traefik/nginx). El volumen `data` conserva los mensajes. Nota: la imagen corre como usuario `node`; si montas una carpeta del host en `/app/data`, dale permisos de escritura a UID 1000.

## Estructura

```
index.html        estructura y marcado
styles.css        diseño, transiciones y responsive
script.js         render desde JSON, filtros, visor, formulario
server.js         estático (lista blanca de rutas) + /api/contact
content/site.json todo el contenido editable
assets/           tus imágenes
scripts/validate.js
data/             mensajes recibidos (ignorado por git)
```

## Ideas para seguir mejorando

- Panel de administración sencillo (login + edición de `site.json` y subida de imágenes).
- Pipeline de imágenes (redimensionado y WebP/AVIF automático, `srcset`).
- Página propia por proyecto (SEO, Open Graph por proyecto) en lugar del visor.
- Versión en inglés (`site.en.json` + selector de idioma).
- Analítica self-hosted (Plausible/Umami) y feed RSS de novedades.
- Notificación del formulario por correo directo (SMTP) además del webhook.
