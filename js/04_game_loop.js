/* ======================================================
   GAME LOOP — CON MISSION DIARY (SAFE)
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

    // 1️⃣ carica manuale start
    await loadStartManual();

    if (!startManual || startManual.length < 10) {
      throw new Error("Start manual non disponibile");
    }

    // 2️⃣ avvia missione (se 05 presente)
    if (typeof startMission === "function") {
      startMission({
        missionId: "MISSION_001",
        location: "Luogo sconosciuto"
      });
      console.log("[04] missione avviata");
    } else {
      console.warn("[04] startMission non disponibile (05 non caricato?)");
    }

    // 3️⃣ chiamata worker — START
    const result = await callWorker({
      action: "start",
      startManual
    });

    if (!result || !result.narration || !result.choices) {
      throw new Error("Risposta worker non valida");
    }

    // 4️⃣ stato locale
    currentNarration = result.narration;
    currentChoices = result.choices;

    // 5️⃣ render
    renderStats(
      playerState,
      typeof missionDiary !== "undefined" ? missionDiary : null
    );

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
    // 1️⃣ chiamata worker — TURNO
    const result = await callWorker({
      action: "turn",
      startManual,
      choice: choiceKey,
      situation: currentNarration,
      missionDiary:
        typeof getMissionDiaryForAI === "function"
          ? getMissionDiaryForAI()
          : []
    });

    if (!result || !result.narration || !result.choices) {
      throw new Error("Risposta worker non valida (turno)");
    }

    // 2️⃣ scrittura Mission Diary (se disponibile)
    if (typeof addMissionDiaryEntry === "function") {
      addMissionDiaryEntry({
        situation: currentNarration,
        choice: choiceKey,
        consequence: result.narration,
        changes: {},
        flags: []
      });
    } else {
      console.warn("[04] addMissionDiaryEntry non disponibile");
    }

    // 3️⃣ aggiorna stato locale
    currentNarration = result.narration;
    currentChoices = result.choices;

    // 4️⃣ render
    clearTestBox();
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
