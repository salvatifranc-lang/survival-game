/* =====================================================
   GAME LOOP
   ===================================================== */

async function playTurn(action) {
  if (DEBUG) {
    console.log("[LOOP] azione:", action);
  }

  const data = await callWorker({
    last_action: action,
     startManual: startManual
  });

  // Aggiorna UI
  renderNarration(data.narration);
  renderChoices(data.choices);

  // Aggiorna diario missione
  missionDiary.log.push({
    turn: missionDiary.log.length + 1,
    narration: data.narration,
    choice: action
  });
}

/* =====================================================
   INIZIALIZZAZIONE GIOCO
   ===================================================== */

async function initGame() {
  try {
    if (DEBUG) console.log("[LOOP] inizializzazione");

    // ⚠️ ORDINE CRITICO
    await loadGameManual();
    await loadStartManual();

    if (DEBUG) {
      console.log("[LOOP] manuali caricati", {
        gameManualLength: gameManual.length,
        startManualLength: startManual.length
      });
    }

    await playTurn("inizio");

    signalLoopOK();
  } catch (err) {
    console.error("[LOOP] errore inizializzazione", err);
    signalLoopError();
  }
}

/* ===== LED ===== */
function signalLoopOK() {
  const led = document.getElementById("led-loop");
  if (!led) return;
  led.classList.remove("err");
  led.classList.add("ok");
}

function signalLoopError() {
  const led = document.getElementById("led-loop");
  if (!led) return;
  led.classList.remove("ok");
  led.classList.add("err");
}

/* =====================================================
   AVVIO AUTOMATICO
   ===================================================== */

initGame();
