/* ======================================================
   GAME LOOP — CON MISSION + CAMPAIGN DIARY (SAFE)
   ====================================================== */

// ADDED — Hope Town
import { LOC_HOPE_TOWN } from "./locations/LOC_HOPE_TOWN.js";

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

// stato missione
let currentLocation = null;
let currentRoom = null;

/* ======================================================
   UTILITY START
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

    // 2️⃣ inizializza campaign diary
    if (typeof initCampaignDiary === "function" && !campaignDiary.synopsis) {
      initCampaignDiary();
    }

    // 3️⃣ selezione location iniziale (NO Hope Town)
    const availableLocations = Object.values(LOCATIONS).filter(
      loc => loc.id !== "LOC_HOPE_TOWN"
    );

    currentLocation = pickRandom(availableLocations);
    currentRoom = currentLocation.map.rooms[currentLocation.entryRoom];
    missionDiary.location = currentLocation.name;

    // 4️⃣ inventario iniziale
    const startInventory = generateStartInventory();

    // 5️⃣ avvio missione
    if (typeof startMission === "function") {
      startMission({
        missionId: "MISSION_001",
        location: currentLocation.name
      });
    }

    // 6️⃣ chiamata worker — START
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

    // 8️⃣ inventario UI + stato
    initInventoryUI();
    applyInventoryEffects({ inventoryAdd: startInventory });

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
   TRANSIZIONE — INGRESSO HOPE TOWN
   ====================================================== */
function enterHopeTown(outcome) {
  console.log("[04] Missione terminata:", outcome);

  currentLocation = LOC_HOPE_TOWN;

  missionDiary.location = LOC_HOPE_TOWN.name;
  missionDiary.turn = 0;
  missionDiary.log = [];
  missionDiary.currentSituation = "";

  campaignDiary.firstMissionCompleted = true;
  campaignDiary.keyEvents.push("ENTERED_HOPE_TOWN");

  callWorker({
    action: "enter_hub",
    location: {
      id: LOC_HOPE_TOWN.id,
      name: LOC_HOPE_TOWN.name,
      type: LOC_HOPE_TOWN.type,
      description: LOC_HOPE_TOWN.description
    },
    campaignDiary
  }).then(result => {
    if (!result?.narration || !result?.choices) return;

    currentNarration = result.narration;
    currentChoices = result.choices;

    renderNarration(currentNarration);
    renderChoices(currentChoices);
    renderStats(playerState, missionDiary);
  });
}

/* ======================================================
   GESTIONE SCELTA GIOCATORE
   ====================================================== */
async function handleChoice(choiceKey) {
  if (!gameStarted || !currentChoices) return;

  try {
    /* ==============================
       TURN
       ============================== */
    const turnResult = await callWorker({
      action: "turn",
      choice: choiceKey,
      situation: missionDiary.currentSituation,
      missionDiary:
        typeof getMissionDiaryForAI === "function"
          ? getMissionDiaryForAI()
          : [],
      campaignDiary,
      location: currentLocation,
      currentRoom
    });

    // ✅ fine missione senza test
    if (turnResult.missionEnded === true) {
      enterHopeTown(turnResult.missionOutcome);
      return;
    }

    if (turnResult.effects) {
      applyInventoryEffects(turnResult.effects);
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

    /* ==============================
       RESOLVE
       ============================== */
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
        campaignDiary,
        location: currentLocation,
        currentRoom
      });

      // ✅ fine missione dopo test
      if (resolveResult.missionEnded === true) {
        enterHopeTown(resolveResult.missionOutcome);
        return;
      }

      if (resolveResult.effects) {
        applyInventoryEffects(resolveResult.effects);
      }

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
