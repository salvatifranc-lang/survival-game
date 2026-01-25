/* =====================================================
   WORKER API — COMUNICAZIONE CON IL WORKER
   ===================================================== */

async function callWorker(payload = {}) {
  try {
    const fullPayload = {
      last_action: payload.last_action || "",
      player_state: playerState,
      campaign_diary: campaignDiary,
      mission_diary: missionDiary,
      game_manual: gameManual,

      // 👇 MANUALE DI INIZIO GIOCO
      start_manual: startManual
    };

    if (DEBUG) {
      console.log("[WORKER] invio payload", {
        last_action: fullPayload.last_action,
        hasGameManual: !!gameManual,
        hasStartManual: !!startManual,
        startManualLength: startManual.length
      });
    }

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullPayload)
    });

    const data = await res.json();

    // Controllo minimo di validità
    if (
      !data ||
      !data.narration ||
      !data.choices ||
      !data.choices.A ||
      !data.choices.B ||
      !data.choices.C
    ) {
      throw new Error("Risposta worker non valida");
    }

    signalWorkerOK();
    return data;

  } catch (err) {
    console.error("[WORKER] errore o fallback", err);
    signalWorkerError();

    // FALLBACK SICURO
    return {
      narration:
        "L’ambiente intorno a te cambia. Qualcosa non è più come prima, e restare fermo è una pessima idea.",
      choices: {
        A: "Avanzare con cautela",
        B: "Cercare riparo",
        C: "Cambiare direzione"
      },
      _fallback: true
    };
  }
}

/* ===== LED ===== */
function signalWorkerOK() {
  const led = document.getElementById("led-worker");
  if (!led) return;
  led.classList.remove("err");
  led.classList.add("ok");
}

function signalWorkerError() {
  const led = document.getElementById("led-worker");
  if (!led) return;
  led.classList.remove("ok");
  led.classList.add("err");
}
