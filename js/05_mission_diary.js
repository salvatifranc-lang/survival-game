/* ======================================================
   05 — MISSION DIARY
   Memoria narrativa di breve termine (missione corrente)
   ====================================================== */

/*
  NOTA:
  - missionDiary DEVE essere dichiarato in 01_state.js
  - Qui NON si ridefinisce lo stato
*/

/* ===== AVVIO NUOVA MISSIONE ===== */
function startMission({ missionId, location }) {
  if (!window.missionDiary) {
    console.warn("[MISSION DIARY] missionDiary non definito nello state");
    return;
  }

  const diary = window.missionDiary;

  diary.mission_id = missionId;
  diary.location = location;
  diary.turn = 0;
  diary.log = [];

  console.log("[MISSION DIARY] nuova missione avviata:", {
    missionId,
    location
  });
}

/* ===== AGGIUNTA ENTRY ===== */
function addMissionDiaryEntry({
  situation,
  choice,
  consequence,
  changes = {},
  flags = []
}) {
  if (!window.missionDiary) {
    console.warn("[MISSION DIARY] impossibile aggiungere entry (diario assente)");
    return;
  }

  const diary = window.missionDiary;

  if (!Array.isArray(diary.log)) {
    diary.log = [];
  }

  diary.turn += 1;

  const entry = {
    turn: diary.turn,
    situation,
    choice,
    consequence,
    changes,
    flags
  };

  diary.log.push(entry);

  console.log("[MISSION DIARY] entry aggiunta:", entry);
}

/* ===== ESTRATTO PER AI ===== */
function getMissionDiaryForAI(limit = 6) {
  if (!window.missionDiary || !Array.isArray(window.missionDiary.log)) {
    return [];
  }

  return window.missionDiary.log.slice(-limit);
}

/* ===== DEBUG ===== */
function printMissionDiary() {
  if (!window.missionDiary) {
    console.warn("[MISSION DIARY] nessun diario presente");
    return;
  }

  console.table(window.missionDiary.log);
}

/* ===== ESPOSIZIONE GLOBALE ===== */
window.startMission = startMission;
window.addMissionDiaryEntry = addMissionDiaryEntry;
window.getMissionDiaryForAI = getMissionDiaryForAI;
window.printMissionDiary = printMissionDiary;

console.log("[MISSION DIARY] modulo inizializzato");
