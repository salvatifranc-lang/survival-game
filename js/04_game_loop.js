/* ======================================================
   GAME LOOP — CON MISSION + CAMPAIGN DIARY (SAFE)
   ====================================================== */

import { playerState } from "./01_state.js";
import { loadStartManual } from "./01_state.js";
import { performRoll } from "./07_dice.js";
import { callWorker } from "./03_worker_api.js";
import { applyInventoryEffects, initInventoryUI } from "./08_inventory.js";

// ADDED — location + items
import { LOCATIONS } from "./locations/locations_registry.js";
import { START_ITEMS_POOL } from "./manuals/items_start_pool.js";

/* ======================================================
   STATO LOCALE
   ====================================================== */
let currentNarration = "";
let currentChoices = null;
let gameStarted = false;

// ADDED — stato missione iniziale
let currentLocation = null;
let currentRoom = null;

/* ======================================================
   UTILITY START (ADDED)
   ====================================================== */
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateStartInventory() {
  const weapon = pickRandom(START_ITEMS_POOL.weapons);
  const tool = pickRandom(START_ITEMS_POOL.tools);
  const consumable = pickRandom(START_ITEMS_POOL.consumables);

  return [
    { id: weapon.id, category: "weapon" },
    { id: tool.id, category: "tool" },
    { id: consumable.id, category: "consumable" }
  ];
}

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

    // 3️⃣ SELEZIONE LOCATION + STANZA INIZIALE (ADDED)
    const availableLocations = Object.values(LOCATIONS);
    currentLocation = pickRandom(availableLocations);
    currentRoom = currentLocation.map.rooms[currentLocation.entryRoom];
missionDiary.location = currentLocation.name;

    // 4️⃣ INVENTARIO INIZIALE (ADDED)
    const startInventory = generateStartInventory();

    // 5️⃣ avvia missione (lasciato invariato)
    if (typeof startMission === "function") {
      startMission({
        missionId: "MISSION_001",
        location: currentLocation.name
      });
    }

    // 6️⃣ chiamata worker — START (ADDED location + room + inventory)
    const result = await callWorker({
      action: "start",
      startManual,
      campaignDiary,
      location: {
        id: currentLocation.id,
        name: currentLocation.name,
        theme: currentLocation.theme,
        missionType: currentLocation.missionType
      },
      currentRoom,
      inventory: startInventory
    });

    if (!result?.narration || !result?.choices) {
      throw new Error("Risposta worker non valida (start)");
    }

    // 7️⃣ stato narrativo
    currentNarration = result.narration;
    currentChoices = result.choices;
    missionDiary.currentSituation = currentNarration;

    // 8️⃣ INVENTARIO INIZIALE (UI + effetti)
    initInventoryUI();
    applyInventoryEffects({
      inventoryAdd: startInventory
    });

    if (result.effects) {
      applyInventoryEffects(result.effects);
    }

    // 9️⃣ render iniziale
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
