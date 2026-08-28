import { fetchPosts, fetchPostById } from "./api.js";
import { renderPostCard, renderPostDetail, renderMessage } from "./render.js";

const app = document.getElementById("app");

/** Muestra el listado de publicaciones. */
async function showList() {
  app.innerHTML = renderMessage("Cargando noticias…");
  try {
    const posts = await fetchPosts();
    if (posts.length === 0) {
      app.innerHTML = renderMessage("No hay noticias publicadas.");
      return;
    }
    app.innerHTML = `<div class="posts-grid">${posts.map(renderPostCard).join("")}</div>`;
  } catch (error) {
    app.innerHTML = renderMessage(`No se pudieron cargar las noticias: ${error.message}`);
  }
}

/**
 * Muestra el detalle de una publicación.
 * @param {string} id Identificador extraído de la ruta hash.
 */
async function showDetail(id) {
  app.innerHTML = renderMessage("Cargando noticia…");
  try {
    const post = await fetchPostById(id);
    if (!post) {
      app.innerHTML = renderMessage("Noticia no encontrada.");
      return;
    }
    app.innerHTML = renderPostDetail(post);
    document.title = `${post.titulo} — Kaedo Kwan Blog`;
  } catch (error) {
    app.innerHTML = renderMessage(`No se pudo cargar la noticia: ${error.message}`);
  }
}

/** Resuelve la ruta actual a partir del hash de la URL. */
export function handleRoute() {
  const hash = window.location.hash || "#/";
  const detailMatch = hash.match(/^#\/post\/(.+)$/);

  window.scrollTo(0, 0);
  document.title = "Kaedo Kwan Blog";

  if (detailMatch) {
    showDetail(decodeURIComponent(detailMatch[1]));
  } else {
    showList();
  }
}

/** Inicializa el enrutador escuchando los cambios de hash. */
export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}
