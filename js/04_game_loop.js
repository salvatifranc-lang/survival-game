/* ======================================================
   GAME LOOP — CON MISSION + CAMPAIGN DIARY (SAFE)
   ====================================================== */

import { playerState } from "./01_state.js";
import { loadStartManual } from "./01_state.js";
import { performRoll } from "./07_dice.js";
import { callWorker } from "./03_worker_api.js";
import { applyInventoryEffects, initInventoryUI } from "./08_inventory.js";

/* ======================================================
   STATO LOCALE
   ====================================================== */
let currentNarration = "";
let currentChoices = null;
let gameStarted = false;

/* ======================================================
   AVVIO PARTITA
   ====================================================== */
async function initGame() {
  try {
    console.log("[04] initGame");

    // 1️⃣ carica manuale di start
    const startManual = await loadStartManual();

    // 2️⃣ inizializza campaign diary (una sola volta)
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
      startManual,
      campaignDiary
    });

    if (!result?.narration || !result?.choices) {
      throw new Error("Risposta worker non valida (start)");
    }

    // 5️⃣ stato narrativo
    currentNarration = result.narration;
    currentChoices = result.choices;
    missionDiary.currentSituation = currentNarration;

    // 6️⃣ INVENTARIO INIZIALE (OBBLIGATORIO)
    initInventoryUI();
    if (result.effects) {
      applyInventoryEffects(result.effects);
    }

    // 7️⃣ render iniziale
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
    /* ==================================================
       TURNO — PRIMA RISPOSTA
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

    // ✅ APPLICA EFFECTS SEMPRE
    if (turnResult.effects) {
      applyInventoryEffects(turnResult.effects);
    }

    /* ==================================================
       CASO: NESSUN TEST
       ================================================== */
    if (turnResult.requiresTest === false) {
      if (!turnResult.narration || !turnResult.choices) {
        throw new Error("Turn senza test non valido");
      }

      currentNarration = turnResult.narration;
      currentChoices = turnResult.choices;
      missionDiary.currentSituation = currentNarration;

      clearTestBox();
      renderNarration(currentNarration);
      renderChoices(currentChoices);
      return;
    }

    /* ==================================================
       CASO: TEST RICHIESTO
       ================================================== */
    if (turnResult.requiresTest === true) {
      const rollResult = performRoll(turnResult.difficulty);

      // mostra risultato del test (gestito da 02_ui + 07)
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

      // ✅ APPLICA EFFECTS DOPO RESOLVE
      if (resolveResult.effects) {
        applyInventoryEffects(resolveResult.effects);
      }

      if (!resolveResult?.narration || !resolveResult?.choices) {
        throw new Error("Risposta resolve non valida");
      }

      currentNarration = resolveResult.narration;
      currentChoices = resolveResult.choices;
      missionDiary.currentSituation = currentNarration;

      renderNarration(currentNarration);
      renderChoices(currentChoices);
      return;
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
