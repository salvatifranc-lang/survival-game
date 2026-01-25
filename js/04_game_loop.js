/* ======================================================
   GAME LOOP — START GAME
   ====================================================== */

let gameInitialized = false;

async function initGame() {
  try {
    console.log("[04] initGame");

    // 1️⃣ CARICA MANUALE DI START
    await loadStartManual();

    if (!startManual || startManual.length < 10) {
      throw new Error("START_MANUAL non disponibile");
    }

    console.log("[04] start manual pronto:", startManual.length);

    // 2️⃣ CHIAMATA AL WORKER (NON ALL’AI)
    const result = await callWorker({
      startManual
    });

    // 3️⃣ RENDER
    renderStats(playerState);
    renderInventory(campaignDiary.inventario || []);
    clearTestBox();

    typeWriter(narrationEl, result.narration, 18);
    renderChoices(result.choices);

    gameInitialized = true;
    signalLoopOK();

  } catch (err) {
    console.error("[04] errore initGame:", err);
    narrationEl.textContent =
      "Errore critico durante l'inizializzazione del gioco.";
    signalLoopError();
  }
}

initGame();

/* ===== LED ===== */
function signalLoopOK() {
  document.getElementById("led-loop")?.classList.add("ok");
}

function signalLoopError() {
  document.getElementById("led-loop")?.classList.add("err");
}

if (typeof DEBUG !== "undefined" && DEBUG) {
  console.log("[04] inizializzato");
}
