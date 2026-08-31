const API_ROOT = "https://api.github.com";

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "kaedo-kwan-bot",
  };
}

/** Convierte un ArrayBuffer a base64 sin desbordar el stack en archivos grandes. */
export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/** Obtiene el contenido (decodificado) y el sha actual de un archivo del repo. */
export async function getFile(env, path) {
  const url = `${API_ROOT}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}?ref=${env.GITHUB_BRANCH}`;
  const response = await fetch(url, { headers: headers(env.GITHUB_TOKEN) });
  if (!response.ok) {
    throw new Error(`No se pudo leer ${path} desde GitHub (HTTP ${response.status})`);
  }
  const data = await response.json();
  const content = atob(data.content.replace(/\n/g, ""));
  return { content, sha: data.sha };
}

/** Crea o actualiza un archivo en el repo vía la Contents API. */
export async function putFile(env, path, base64Content, message, sha) {
  const url = `${API_ROOT}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: headers(env.GITHUB_TOKEN),
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: env.GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`No se pudo escribir ${path} en GitHub (HTTP ${response.status}): ${detail}`);
  }
  return response.json();
}
