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

    await loadStartManual();

    if (!startManual || startManual.length < 10) {
      throw new Error("Start manual non disponibile");
    }

    if (typeof initCampaignDiary === "function" && !campaignDiary.synopsis) {
      initCampaignDiary();
    }

    if (typeof startMission === "function") {
      startMission({
        missionId: "MISSION_001",
        location: "Luogo sconosciuto"
      });
    }

    const result = await callWorker({
      action: "start",
      startManual,
      campaignDiary
    });

    currentNarration = result.narration;
    currentChoices = result.choices;
    missionDiary.currentSituation = currentNarration;

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

  try {
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

    // ===== NESSUN TEST =====
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

    // ===== TEST RICHIESTO =====
    if (turnResult.requiresTest === true) {
      const rollResult = performRoll(turnResult.difficulty);
      renderTestBox();

      const resolveResult = await callWorker({
        action: "resolve",
        choice: choiceKey,
        outcome: rollResult.outcome,
        situation: missionDiary.currentSituation,
        missionDiary:
          typeof getMissionDiaryForAI === "function"
            ? getMissionDiaryForAI()
            : [],
        campaignDiary
      });

      currentNarration = resolveResult.narration;
      currentChoices = resolveResult.choices;
      missionDiary.currentSituation = currentNarration;

      typeWriter(narrationEl, currentNarration, 18, () => {
        renderChoices(currentChoices);
      });

      return;
    }

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
