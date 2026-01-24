/* ======================================================
   STATE & MEMORIA DI GIOCO
   ====================================================== */

/* ===== STATO GIOCATORE ===== */
let playerState = {
  salute: 10,
  stamina: 10,
  livello: 1
};

/* ===== MEMORIA LUNGA (CAMPAGNA) ===== */
let campaignDiary = {
  synopsis: "",
  inventario: [],
  abilita: []
};

/* ===== MEMORIA BREVE (MISSIONE) ===== */
let missionDiary = {
  log: [],
  currentSituation: null
};

/* ===== SEGNA FILE CARICATO ===== */
document.getElementById("led-state")?.classList.add("ok");

/* ===== DEBUG (opzionale) ===== */
if (typeof DEBUG !== "undefined" && DEBUG) {
  console.log("[STATE] inizializzato", {
    playerState,
    campaignDiary,
    missionDiary
  });
}
