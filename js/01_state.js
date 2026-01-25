/* ======================================================
   STATE & MEMORIA DI GIOCO
   ====================================================== */

/* ===== MANUALE DI GIOCO (IMMUTABILE) ===== */
let gameManual = "";

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
  abilita: [],
  firstMissionCompleted: false
};

/* ===== MEMORIA BREVE (MISSIONE) ===== */
let missionDiary = {
  log: [],
  currentLocation: null
};

/* ======================================================
   CARICAMENTO MANUALE
   ====================================================== */

async function loadGameManual() {
  try {
    const res = await fetch(MANUAL_URL);
    gameManual = await res.text();

    console.log("[MANUAL] caricato correttamente");
    document.getElementById("led-config")?.classList.add("ok");

  } catch (err) {
    console.error("[MANUAL] errore nel caricamento", err);
    document.getElementById("led-config")?.classList.add("err");
  }
}
let startManual = "";

async function loadStartManual() {
  try {
    const res = await fetch(START_MANUAL_URL);
    startManual = await res.text();
    console.log("[START MANUAL] caricato correttamente");
  } catch (err) {
    console.error("[START MANUAL] errore caricamento", err);
    startManual = "";
  }
}

/* ===== AVVIO ===== */
loadGameManual();

/* ======================================================
   DEBUG
   ====================================================== */

if (typeof DEBUG !== "undefined" && DEBUG) {
  console.log("[STATE] inizializzato", {
    playerState,
    campaignDiary,
    missionDiary
  });
}

/* ===== LED STATE ===== */
document.getElementById("led-state")?.classList.add("ok");
