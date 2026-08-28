import { initRouter } from "./router.js";
import { initTheme } from "./theme.js";
import { initSidebar } from "./sidebar.js";

initTheme();
initSidebar();
initRouter();

document.getElementById("year").textContent = new Date().getFullYear();
