# kaedo-kwan-bot

Cloudflare Worker que recibe el webhook de un bot de Telegram y publica noticias directamente en `data/posts.json` de `kaedo-kwan-blog` (rama `main`), subiendo también la imagen de portada a `assets/img/`.

## Formato de publicación

Enviar al bot una **foto** con caption en este formato exacto:

```
Título de la noticia
Nombre del autor
Resumen breve de una línea

Primer párrafo del contenido.

Segundo párrafo (opcional).
```

Líneas 1–3: título, autor y resumen. Después de una línea en blanco, el resto es el contenido (los párrafos separados por línea en blanco se muestran como párrafos independientes en el sitio).

## Variables de entorno

En `wrangler.toml` (`[vars]`, no sensibles):
- `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`
- `SITE_BASE_URL` — para incluir el link al post publicado en la respuesta del bot
- `ALLOWED_CHAT_IDS` — lista opcional separada por comas de `chat_id` autorizados a publicar; vacío = sin restricción

Secretos (`wrangler secret put <NOMBRE>`):
- `TELEGRAM_BOT_TOKEN` — token del bot (BotFather)
- `TELEGRAM_WEBHOOK_SECRET` — cadena aleatoria propia, usada para validar que las peticiones al Worker vienen de Telegram
- `GITHUB_TOKEN` — Personal Access Token (fine-grained) con permiso *Contents: Read and write* solo sobre `kaedo-kwan-blog`

## Registro del webhook

Tras desplegar el Worker, apunta el webhook de Telegram a su URL pública indicando el mismo `TELEGRAM_WEBHOOK_SECRET` como `secret_token` (ver método `setWebhook` de la API de Bots de Telegram).

## Nota de seguridad

Con `ALLOWED_CHAT_IDS` vacío, cualquier persona que escriba al bot puede publicar en el blog. Se recomienda mantener el usuario del bot privado o completar esa lista en cuanto sea posible.
