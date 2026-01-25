/* ======================================================
   GAME LOOP — CON MISSION + CAMPAIGN DIARY (SAFE)
   ====================================================== */

import { performRoll } from "./07_dice.js";

let currentNarration = "";
let currentChoices = null;
let gameStarted = false;

/* ======================================================
   AVVIO PARTITA
   ====================================================== */
async function initGame() {
  try {
    console.log("[04] initGame");

    // 1️⃣ carica manuale start
    await loadStartManual();

    if (!startManual || startManual.length < 10) {
      throw new Error("Start manual non disponibile");
    }

    // 1️⃣.5 inizializza campaign diary (UNA SOLA VOLTA)
    if (typeof initCampaignDiary === "function" && !campaignDiary.synopsis) {
      initCampaignDiary();
      console.log("[04] campaign diary inizializzato");
    }

    // 2️⃣ avvia missione
    if (typeof startMission === "function") {
      startMission({
        missionId: "MISSION_001",
        location: "Luogo sconosciuto"
      });
      console.log("[04] missione avviata");
    }

    // 3️⃣ chiamata worker — START
    const result = await callWorker({
      action: "start",
      startManual,
      campaignDiary
    });

    if (!result || !result.narration || !result.choices) {
      throw new Error("Risposta worker non valida (start)");
    }

    currentNarration = result.narration;
    currentChoices = result.choices;
    missionDiary.currentSituation = currentNarration;

    // 4️⃣ render iniziale
    renderStats(playerState, missionDiary);
    clearTestBox();

    typeWriter(narrationEl, currentNarration, 18, () => {
      renderChoices(currentChoices);
    });

    gameStarted = true;
    console.log("[04] gioco avviato");

  } catch (err) {
    console.error("[04] errore initGame:", err);
    narrationEl.textContent =
      "Errore critico durante l'inizializzazione del gioco.";
  }
}

/* ======================================================
   GESTIONE SCELTA GIOCATORE
   ====================================================== */
async function handleChoice(choiceKey) {
  if (!gameStarted || !currentChoices) return;

  console.log("[04] scelta:", choiceKey);

  try {
    /* ==================================================
       1️⃣ TURNO: L’IA DECIDE SE SERVE UN TEST
       ================================================== */
    const turnResult = await callWorker({
      action: "turn",
      choice: choiceKey,
      situation: missionDiary.currentSituation,
      missionDiary:
        typeof getMissionDiaryForAI === "function"
          ? getMissionDiaryForAI()
          : [],
      campaignDiary
    });

    /* ==================================================
       2️⃣ CASO: NESSUN TEST
       ================================================== */
    if (turnResult.requiresTest === false) {
      currentNarration = turnResult.narration;
      currentChoices = turnResult.choices;
      missionDiary.currentSituation = currentNarration;

      clearTestBox();

      typeWriter(narrationEl, currentNarration, 18, () => {
        renderChoices(currentChoices);
      });

      return;
    }

    /* ==================================================
       3️⃣ CASO: TEST RICHIESTO
       ================================================== */
    if (turnResult.requiresTest === true) {
      const difficulty = turnResult.difficulty;

      /* === TIRO DI DADO (JS) === */
      const rollResult = performRoll(difficulty);

      // Mostra il risultato del test
      renderTestBox();

      /* === CONSEGUENZA NARRATIVA === */
      const resolveResult = await callWorker({
        action: "resolve",
        choice: choiceKey,
        outcome: rollResult.outcome, // ⬅️ SOLO ETICHETTA TESTUALE
        situation: missionDiary.currentSituation,
        missionDiary:
          typeof getMissionDiaryForAI === "function"
            ? getMissionDiaryForAI()
            : [],
