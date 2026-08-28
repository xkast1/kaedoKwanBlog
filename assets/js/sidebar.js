const STORAGE_KEY = "kaedo-kwan-sidebar-collapsed";

/** Aplica el estado colapsado/expandido al sidebar y actualiza el botón. */
function applyState(sidebar, toggle, collapsed) {
  sidebar.classList.toggle("is-collapsed", collapsed);
  toggle.setAttribute("aria-expanded", String(!collapsed));
  localStorage.setItem(STORAGE_KEY, String(collapsed));
}

/** Inicializa el menú lateral colapsable y restaura la última preferencia. */
export function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("sidebar-toggle");

  applyState(sidebar, toggle, localStorage.getItem(STORAGE_KEY) === "true");

  toggle.addEventListener("click", () => {
    applyState(sidebar, toggle, !sidebar.classList.contains("is-collapsed"));
  });
}
