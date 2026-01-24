/* ======================================================
   CONFIGURAZIONE GLOBALE
   ====================================================== */

const WORKER_URL = "https://still-hat-5795.salvatifranc.workers.dev/";
const MANUAL_URL =
  "https://raw.githubusercontent.com/salvatifranc-lang/survival-game/main/HOPE_TOWN_GAME_MANUAL.txt";

const DEBUG = true;

/* ===== LED CONFIG (DOM SAFE) ===== */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("led-config")?.classList.add("ok");
});

/* ===== DEBUG ===== */
if (DEBUG) {
  console.log("[CONFIG] caricato");
}
