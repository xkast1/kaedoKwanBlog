import { sendMessage, getFilePath, downloadFile } from "./telegram.js";
import { getFile, putFile, arrayBufferToBase64 } from "./github.js";
import { parseCaption } from "./parser.js";

const USAGE = [
  "Para publicar una noticia, envía una *foto* con este formato de caption:",
  "",
  "Título",
  "Autor",
  "Resumen breve",
  "",
  "Primer párrafo del contenido.",
  "",
  "Segundo párrafo (opcional).",
].join("\n");

/** Verifica que la petición provenga realmente de Telegram (header secreto del webhook). */
function isValidSecret(request, env) {
  return request.headers.get("X-Telegram-Bot-Api-Secret-Token") === env.TELEGRAM_WEBHOOK_SECRET;
}

/** Verifica si el chat está autorizado a publicar (allowlist opcional). */
function isChatAllowed(chatId, env) {
  const allowlist = (env.ALLOWED_CHAT_IDS || "").split(",").map((id) => id.trim()).filter(Boolean);
  return allowlist.length === 0 || allowlist.includes(String(chatId));
}

/** Publica un nuevo post en data/posts.json y sube la imagen de portada a GitHub. */
async function publishPost({ titulo, autor, resumen, contenido }, photoBuffer, extension, env) {
  const { content: postsRaw, sha: postsSha } = await getFile(env, "data/posts.json");
  const postsData = JSON.parse(postsRaw);
  const nextId = postsData.posts.reduce((max, post) => Math.max(max, Number(post.id) || 0), 0) + 1;

  const imagePath = `assets/img/telegram-${nextId}.${extension}`;
  await putFile(env, imagePath, arrayBufferToBase64(photoBuffer), `chore: sube portada del post ${nextId}`);

  const fecha = new Date().toISOString().slice(0, 10);
  postsData.posts.push({ id: nextId, titulo, resumen, contenido, fecha, autor, imagen: imagePath });

  const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(postsData, null, 2) + "\n")));
  await putFile(env, "data/posts.json", updatedContent, `content: publica "${titulo}"`, postsSha);

  return nextId;
}

async function handleMessage(message, env) {
  const chatId = message.chat.id;

  if (!isChatAllowed(chatId, env)) {
    await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, "No tienes autorización para publicar en este blog.");
    return;
  }

  if (!message.photo || message.photo.length === 0) {
    await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, USAGE);
    return;
  }

  try {
    const fields = parseCaption(message.caption);
    const largestPhoto = message.photo[message.photo.length - 1];
    const filePath = await getFilePath(env.TELEGRAM_BOT_TOKEN, largestPhoto.file_id);
    const extension = filePath.split(".").pop() || "jpg";
    const photoBuffer = await downloadFile(env.TELEGRAM_BOT_TOKEN, filePath);

    const id = await publishPost(fields, photoBuffer, extension, env);

    const link = env.SITE_BASE_URL ? `\n${env.SITE_BASE_URL}/#/post/${id}` : "";
    await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, `✅ Publicado: "${fields.titulo}"${link}`);
  } catch (error) {
    await sendMessage(env.TELEGRAM_BOT_TOKEN, chatId, `❌ ${error.message}`);
  }
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }
    if (!isValidSecret(request, env)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const update = await request.json();
    if (update.message) {
      await handleMessage(update.message, env);
    }

    return new Response("OK", { status: 200 });
  },
};
