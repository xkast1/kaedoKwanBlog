const DATA_URL = "data/posts.json";

let cache = null;

/**
 * Obtiene y cachea las publicaciones desde el JSON externo.
 * @returns {Promise<Array<object>>} Lista de publicaciones ordenadas por fecha descendente.
 */
export async function fetchPosts() {
  if (cache) return cache;

  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Error al cargar los datos (HTTP ${response.status})`);
  }

  const data = await response.json();
  cache = [...data.posts].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );
  return cache;
}

/**
 * Busca una publicación por su identificador.
 * @param {string|number} id Identificador de la publicación.
 * @returns {Promise<object|undefined>} La publicación encontrada o undefined.
 */
export async function fetchPostById(id) {
  const posts = await fetchPosts();
  return posts.find((post) => String(post.id) === String(id));
}
