/* ======================================================
   GAME LOOP — CON MISSION + CAMPAIGN DIARY (SAFE)
   ====================================================== */

import { loadStartManual } from "./01_state.js";
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

    // 1️⃣ carica manuale start (gestito dallo STATE)
    await loadStartManual();

    // ❌ NON controllare startManual qui
    // lo state è la fonte di verità

    // 2️⃣ inizializza campaign diary
    if (typeof initCampaignDiary === "function" && !campaignDiary.synopsis) {
      initCampaignDiary();
    }

    // 3️⃣ avvia missione
    if (typeof startMission === "function") {
      startMission({
        missionId: "MISSION_001",
        location: "Luogo sconosciuto"
      });
    }

    // 4️⃣ chiamata worker — START
    const result = await callWorker({
      action: "start",
      startManual: window.startManual, // ✅ STATO GLOBALE
      campaignDiary
    });

    if (!result || !result.narration || !result.choices) {
      throw new Error("Risposta worker non valida (start)");
    }

    // 5️⃣ stato locale
    currentNarration = result.narration;
    currentChoices = result.choices;
    missionDiary.currentSituation = currentNarration;

    // 6️⃣ render iniziale
    renderStats(playerState, missionDiary);
    clearTestBox();

    renderNarration(currentNarration);
    renderChoices(currentChoices);

    gameStarted = true;
    console.log("[04] gioco avviato");

  } catch (err) {
    console.error("[04] errore initGame:", err);
    renderNarration(
      "Errore critico durante l'inizializzazione del gioco."
    );
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

    if (!turnResult || !turnResult.narration || !turnResult.choices) {
      throw new Error("Risposta worker non valida (turn)");
    }

    if (turnResult.requiresTest === false) {
      currentNarration = turnResult.narration;
      currentChoices = turnResult.choices;
      missionDiary.currentSituation = currentNarration;

      clearTestBox();
      renderNarration(currentNarration);
      renderChoices(currentChoices);
      return;
    }

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

      renderNarration(currentNarration);
      renderChoices(currentChoices);
    }

  } catch (err) {
    console.error("[04] errore turno:", err);
    renderNarration(
      "Qualcosa va storto. Il mondo sembra reagire male alla tua scelta."
    );
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
