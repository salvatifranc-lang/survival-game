/* ======================================================
   CONFIGURAZIONE GLOBALE
   ====================================================== */
// ===== WORKER BACKEND =====
const WORKER_ENDPOINT = "https://still-hat-5795.salvatifranc.workers.dev/";

const WORKER_URL = "https://still-hat-5795.salvatifranc.workers.dev/";
export const START_MANUAL_URL = "HOPE_TOWN_START_MANUAL.txt";
export const MANUAL_URL = "HOPE_TOWN_START_MANUAL.txt"; // o il path corretto

// DADOTEST
export const DIFFICULTY_LEVELS = [
  "Estremo",
  "Molto Rischioso",
  "Rischioso",
  "Standard",
  "Facile",
  "Molto Facile"
];
export const OUTCOME_LABELS = {
  CRITICAL_FAIL: "Fallimento critico",
  FAIL: "Fallimento",
  PARTIAL: "Successo parziale",
  SUCCESS: "Successo pieno",
  BONUS: "Successo con bonus"
};

export const DICE_TABLE = {
  "Estremo": [
    OUTCOME_LABELS.CRITICAL_FAIL,
    OUTCOME_LABELS.CRITICAL_FAIL,
    OUTCOME_LABELS.FAIL,
    OUTCOME_LABELS.FAIL,
    OUTCOME_LABELS.PARTIAL,
    OUTCOME_LABELS.BONUS
  ],
  "Molto Rischioso": [
    OUTCOME_LABELS.CRITICAL_FAIL,
    OUTCOME_LABELS.FAIL,
    OUTCOME_LABELS.FAIL,
    OUTCOME_LABELS.PARTIAL,
    OUTCOME_LABELS.SUCCESS,
    OUTCOME_LABELS.BONUS
  ],
  "Rischioso": [
    OUTCOME_LABELS.CRITICAL_FAIL,
    OUTCOME_LABELS.FAIL,
    OUTCOME_LABELS.PARTIAL,
    OUTCOME_LABELS.PARTIAL,
    OUTCOME_LABELS.SUCCESS,
    OUTCOME_LABELS.BONUS
  ],
  "Standard": [
    OUTCOME_LABELS.CRITICAL_FAIL,
    OUTCOME_LABELS.FAIL,
    OUTCOME_LABELS.PARTIAL,
    OUTCOME_LABELS.PARTIAL,
    OUTCOME_LABELS.SUCCESS,
    OUTCOME_LABELS.BONUS
  ],
  "Facile": [
    OUTCOME_LABELS.FAIL,
    OUTCOME_LABELS.PARTIAL,
    OUTCOME_LABELS.SUCCESS,
    OUTCOME_LABELS.SUCCESS,
    OUTCOME_LABELS.BONUS,
    OUTCOME_LABELS.BONUS
  ],
  "Molto Facile": [
    OUTCOME_LABELS.PARTIAL,
    OUTCOME_LABELS.PARTIAL,
    OUTCOME_LABELS.SUCCESS,
    OUTCOME_LABELS.SUCCESS,
    OUTCOME_LABELS.BONUS,
    OUTCOME_LABELS.BONUS
  ]
};

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
