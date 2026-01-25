/* ======================================================
   05 — MISSION DIARY
   Memoria narrativa di breve termine
   ====================================================== */

/* ===== AVVIO NUOVA MISSIONE ===== */
function startMission({ missionId, location }) {
  if (!window.missionDiary) {
    console.warn("[MISSION DIARY] missionDiary non presente nello state");
    return;
  }

  window.missionDiary.mission_id = missionId;
  window.missionDiary.location = location;
  window.missionDiary.turn = 0;
  window.missionDiary.log = [];

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
    console.warn("[MISSION DIARY] impossibile aggiungere entry (diary assente)");
    return;
  }

  window.missionDiary.turn += 1;

  const entry = {
    turn: window.missionDiary.turn,
    situation,
    choice,
    consequence,
    changes,
    flags
  };

  window.missionDiary.log.push(entry);

  console.log("[MISSION DIARY] entry aggiunta:", entry);
}

/* ===== ESTRATTO PER AI ===== */
function getMissionDiaryForAI(limit = 6) {
  if (!window.missionDiary) return [];
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
