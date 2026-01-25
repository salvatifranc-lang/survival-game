/* ======================================================
   MISSION DIARY — MEMORIA NARRATIVA DI BREVE TERMINE
   ====================================================== */

const missionDiary = {
  mission_id: null,
  location: null,
  turn: 0,
  log: []
};

/* ===== AVVIO NUOVA MISSIONE ===== */
function startMission({ missionId, location }) {
  missionDiary.mission_id = missionId;
  missionDiary.location = location;
  missionDiary.turn = 0;
  missionDiary.log = [];

  console.log("[MISSION DIARY] nuova missione:", missionId);
}

/* ===== AGGIUNGI ENTRY ===== */
function addMissionDiaryEntry({
  situation,
  choice,
  consequence,
  changes = {},
  flags = []
}) {
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

/* ===== LETTURA PER AI ===== */
function getMissionDiaryForAI(limit = 6) {
  return missionDiary.log.slice(-limit);
}

/* ===== DEBUG ===== */
function printMissionDiary() {
  console.table(missionDiary.log);
}

/* ===== ESPOSIZIONE ===== */
window.missionDiary = missionDiary;
window.startMission = startMission;
window.addMissionDiaryEntry = addMissionDiaryEntry;
window.getMissionDiaryForAI = getMissionDiaryForAI;
window.printMissionDiary = printMissionDiary;

console.log("[MISSION DIARY] modulo inizializzato");
