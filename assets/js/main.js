import { initRouter } from "./router.js";
import { initTheme } from "./theme.js";

initTheme();
initRouter();

document.getElementById("year").textContent = new Date().getFullYear();
