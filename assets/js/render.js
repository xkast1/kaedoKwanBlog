/**
 * Escapa caracteres HTML para prevenir inyección (XSS) desde el JSON.
 * @param {string} value Texto sin sanear.
 * @returns {string} Texto seguro para interpolar en HTML.
 */
export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a formato legible en español.
 * @param {string} isoDate Fecha en formato ISO.
 * @returns {string} Fecha formateada.
 */
export function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("es", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Genera la tarjeta HTML de una publicación para el listado.
 * @param {object} post Publicación con id, titulo, resumen, fecha, autor, imagen.
 * @returns {string} Fragmento HTML de la tarjeta.
 */
export function renderPostCard(post) {
  return `
    <article class="post-card">
      <img class="post-card__image" src="${escapeHtml(post.imagen)}"
           alt="${escapeHtml(post.titulo)}" loading="lazy" />
      <div class="post-card__body">
        <h2 class="post-card__title">
          <a href="#/post/${encodeURIComponent(post.id)}">${escapeHtml(post.titulo)}</a>
        </h2>
        <p class="post-card__meta">${formatDate(post.fecha)} · ${escapeHtml(post.autor)}</p>
        <p class="post-card__summary">${escapeHtml(post.resumen)}</p>
        <a class="post-card__link" href="#/post/${encodeURIComponent(post.id)}">Leer más →</a>
      </div>
    </article>
  `;
}

/**
 * Genera la vista de detalle de una publicación con párrafos separados por doble salto de línea.
 * @param {object} post Publicación completa.
 * @returns {string} Fragmento HTML del detalle.
 */
export function renderPostDetail(post) {
  const paragraphs = String(post.contenido)
    .split(/\n\s*\n/)
    .map((p) => `<p>${escapeHtml(p.trim())}</p>`)
    .join("");

  return `
    <article class="post-detail">
      <a class="back-link" href="#/">← Volver al listado</a>
      <img class="post-detail__image" src="${escapeHtml(post.imagen)}"
           alt="${escapeHtml(post.titulo)}" />
      <h1 class="post-detail__title">${escapeHtml(post.titulo)}</h1>
      <p class="post-detail__meta">${formatDate(post.fecha)} · ${escapeHtml(post.autor)}</p>
      <div class="post-detail__content">${paragraphs}</div>
    </article>
  `;
}

/**
 * Genera un mensaje de estado (carga, error o vacío).
 * @param {string} message Texto a mostrar.
 * @returns {string} Fragmento HTML del mensaje.
 */
export function renderMessage(message) {
  return `<p class="state-message">${escapeHtml(message)}</p>`;
}
