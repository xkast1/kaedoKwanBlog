export function parseCaption(caption) {
  if (!caption || !caption.trim()) {
    throw new Error(
      "Falta el caption. Formato esperado:\n\nTítulo\nAutor\nResumen\n\nPárrafo 1 del contenido.\n\nPárrafo 2 (opcional)."
    );
  }

  const lines = caption.split(/\r?\n/);
  if (lines.length < 3) {
    throw new Error("Caption incompleto: se requieren al menos Título, Autor y Resumen en las 3 primeras líneas.");
  }

  const titulo = lines[0].trim();
  const autor = lines[1].trim();
  const resumen = lines[2].trim();

  if (!titulo || !autor || !resumen) {
    throw new Error("Título, Autor y Resumen no pueden estar vacíos.");
  }

  let contentStart = 3;
  while (contentStart < lines.length && lines[contentStart].trim() === "") {
    contentStart++;
  }
  const contenido = lines.slice(contentStart).join("\n").trim();

  if (!contenido) {
    throw new Error("Falta el contenido: deja una línea en blanco después del resumen y escribe el cuerpo de la noticia.");
  }

  return { titulo, autor, resumen, contenido };
}
