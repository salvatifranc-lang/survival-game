/* ======================================================
   GAME LOOP — CON MISSION DIARY
   ====================================================== */

let currentNarration = "";
let currentChoices = null;
let gameStarted = false;

/* ===== AVVIO PARTITA ===== */
async function initGame() {
  try {
    console.log("[04] initGame");

    // 1️⃣ carica manuale start
    await loadStartManual();

    if (!startManual || startManual.length < 10) {
      throw new Error("Start manual non disponibile");
    }

    // 2️⃣ avvia missione
    startMission({
      missionId: "MISSION_001",
      location: "Superficie sconosciuta"
    });

    console.log("[04] missione avviata");

    // 3️⃣ chiamata worker — START
    const result = await callWorker({
      action: "start",
      startManual
    });

    // 4️⃣ render
    currentNarration = result.narration;
    currentChoices = result.choices;

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

  const chosenText = currentChoices[choiceKey];

  try {
    // 1️⃣ chiamata worker — TURNO
    const result = await callWorker({
      action: "turn",
      startManual,
      choice: choiceKey,
      situation: currentNarration,
      missionDiary: getMissionDiaryForAI()
    });

    // 2️⃣ scrittura Mission Diary
    addMissionDiaryEntry({
      situation: currentNarration,
      choice: choiceKey,
      consequence: result.narration,
      changes: {
        objective: "avanzato"
      },
      flags: []
    });

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
