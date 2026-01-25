/* ======================================================
   05 — MISSION DIARY
   Memoria narrativa di breve termine (missione corrente)
   ====================================================== */

/*
  ⚠️ NOTA IMPORTANTE
  - missionDiary DEVE essere dichiarato in 01_state.js
  - Qui NON si ridefinisce lo stato, si lavora SOLO sulla logica
*/

/* ===== AVVIO NUOVA MISSIONE ===== */
function startMission({ missionId, location }) {
  if (!window.missionDiary) {
    throw new Error("missionDiary non definito nello stato");
  }

  window.missionDiary.mission_id = missionId;
  window.missionDiary.location = location;
  window.missionDiary.turn = 0;
  window.missionDiary.log = [];

  console.log("[MISSION DIARY] nuova missione:", missionId);
}


  missionDiary.mission_id = missionId;
  missionDiary.location = location;
  missionDiary.turn = 0;
  missionDiary.log = [];

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
  if (!missionDiary) return;

  missionDiary.turn += 1;

  const entry = {
    turn: missionDiary.turn,
    situation,
    choice,
    consequence,
    changes,
    flags
  };

  missionDiary.log.push(entry);

  console.log("[MISSION DIARY] entry aggiunta:", entry);
}

/* ===== ESTRATTO PER AI ===== */
function getMissionDiaryForAI(limit = 6) {
  if (!missionDiary) return [];
  return missionDiary.log.slice(-limit);
}

/* ===== DEBUG ===== */
function printMissionDiary() {
  if (!missionDiary) {
    console.warn("[MISSION DIARY] nessun diario presente");
    return;
  }
  console.table(missionDiary.log);
}

/* ===== ESPOSIZIONE GLOBALE ===== */
window.startMission = startMission;
window.addMissionDiaryEntry = addMissionDiaryEntry;
window.getMissionDiaryForAI = getMissionDiaryForAI;
window.printMissionDiary = printMissionDiary;

console.log("[MISSION DIARY] modulo inizializzato");
