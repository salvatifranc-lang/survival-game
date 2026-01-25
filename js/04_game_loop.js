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
       1️⃣ CHIEDI AL WORKER LA DIFFICOLTÀ
       ================================================== */
    const difficultyResult = await callWorker({
      action: "difficulty",
      choice: choiceKey,
      situation: missionDiary.currentSituation,
      missionDiary:
        typeof getMissionDiaryForAI === "function"
          ? getMissionDiaryForAI()
          : [],
      campaignDiary
    });

    const difficulty = difficultyResult?.difficulty;
    if (!difficulty) {
      throw new Error("Difficoltà non valida dal worker");
    }

    /* ==================================================
       2️⃣ TIRO DI DADO (JS)
       ================================================== */
    const rollResult = performRoll(difficulty);

    // Mostra subito il risultato del test in UI
    renderTestBox();

    /* ==================================================
       3️⃣ CONSEGUENZA NARRATIVA (IA)
       ================================================== */
    const narrativeResult = await callWorker({
      action: "resolve",
      choice: choiceKey,
      outcome: rollResult.outcome, // ⬅️ SOLO ETICHETTA TESTUALE
      situation: missionDiary.currentSituation,
      missionDiary:
        typeof getMissionDiaryForAI === "function"
          ? getMissionDiaryForAI()
          : [],
      campaignDiary
    });

    if (!narrativeResult || !narrativeResult.narration || !narrativeResult.choices) {
      throw new Error("Risposta worker non valida (resolve)");
    }

    /* ==================================================
       4️⃣ MISSION DIARY
       ================================================== */
    if (typeof addMissionDiaryEntry === "function") {
      addMissionDiaryEntry({
        situation: missionDiary.currentSituation,
        choice: choiceKey,
        outcome: rollResult.outcome,
        consequence: narrativeResult.narration,
        changes: {},
        flags: []
      });
    }

    /* ==================================================
       5️⃣ AGGIORNA STATO + RENDER
       ================================================== */
    currentNarration = narrativeResult.narration;
    currentChoices = narrativeResult.choices;
    missionDiary.currentSituation = currentNarration;

    typeWriter(narrationEl, currentNarration, 18, () => {
      renderChoices(currentChoices);
    });

  } catch (err) {
    console.error("[04] errore turno:", err);
    narrationEl.textContent =
      "Qualcosa va storto. Il mondo sembra reagire male alla tua scelta.";
  }
}

/* ======================================================
   EVENTI UI
   ====================================================== */
btnA.addEventListener("click", () => handleChoice("A"));
btnB.addEventListener("click", () => handleChoice("B"));
btnC.addEventListener("click", () => handleChoice("C"));

/* ======================================================
   AVVIO
   ====================================================== */
console.log("[04] inizializzato");
initGame();
