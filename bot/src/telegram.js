const API_ROOT = "https://api.telegram.org";

/** Llama a un método del API de Bots de Telegram. */
async function callApi(token, method, payload) {
  const response = await fetch(`${API_ROOT}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.ok) {
    throw new Error(`Telegram API (${method}) falló: ${data.description || response.status}`);
  }
  return data.result;
}

/** Envía un mensaje de texto a un chat. */
export function sendMessage(token, chatId, text) {
  return callApi(token, "sendMessage", { chat_id: chatId, text });
}

/** Resuelve la ruta de descarga de un file_id de Telegram. */
export async function getFilePath(token, fileId) {
  const result = await callApi(token, "getFile", { file_id: fileId });
  return result.file_path;
}

/** Descarga el binario de un archivo alojado en los servidores de Telegram. */
export async function downloadFile(token, filePath) {
  const response = await fetch(`${API_ROOT}/file/bot${token}/${filePath}`);
  if (!response.ok) {
    throw new Error(`No se pudo descargar el archivo de Telegram (HTTP ${response.status})`);
  }
  return response.arrayBuffer();
}
