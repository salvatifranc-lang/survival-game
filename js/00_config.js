/* ======================================================
   CONFIGURAZIONE GLOBALE
   ====================================================== */
// ===== WORKER BACKEND =====
const WORKER_ENDPOINT = "https://still-hat-5795.salvatifranc.workers.dev/";

const WORKER_URL = "https://still-hat-5795.salvatifranc.workers.dev/";
const MANUAL_URL =
  "https://raw.githubusercontent.com/salvatifranc-lang/survival-game/main/HOPE_TOWN_GAME_MANUAL.txt";
const START_MANUAL_URL = "HOPE_TOWN_START_MANUAL.txt";

const DEBUG = true;
const AI_ENDPOINT = "/api/ai"; 
/* ===== LED CONFIG (DOM SAFE) ===== */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("led-config")?.classList.add("ok");
});

/* ===== DEBUG ===== */
if (DEBUG) {
  console.log("[CONFIG] caricato");
}
