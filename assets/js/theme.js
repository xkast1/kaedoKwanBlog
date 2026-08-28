const STORAGE_KEY = "kaedo-kwan-theme";

/** Aplica el tema indicado al documento y lo persiste. */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

/** Resuelve el tema inicial: preferencia guardada o preferencia del sistema. */
function resolveInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Inicializa el tema y conecta el botón de alternancia. */
export function initTheme() {
  applyTheme(resolveInitialTheme());

  const toggle = document.getElementById("theme-toggle");
  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}
