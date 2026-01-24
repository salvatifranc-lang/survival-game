/* ======================================================
   CONFIGURAZIONE GLOBALE
   ====================================================== */

// URL del Worker Cloudflare
const WORKER_URL = "https://still-hat-5795.salvatifranc.workers.dev/";

// URL del Manuale di Gioco (testo puro)
const MANUAL_URL =
  "https://raw.githubusercontent.com/salvatifranc-lang/survival-game/main/HOPE_TOWN_GAME_MANUAL.txt";

// Flag di debug globale
const DEBUG = true;

/* ===== SEGNA FILE CARICATO (LED CONFIG) ===== */
document.getElementById("led-config")?.classList.add("ok");

/* ===== DEBUG ===== */
if (DEBUG) {
  console.log("[CONFIG] caricato", {
    WORKER_URL,
    MANUAL_URL
  });
}
