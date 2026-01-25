/* ======================================================
   WORKER API — FRONTEND BRIDGE (START + TURN)
   ====================================================== */

async function callWorker(payload = {}) {
  try {
    console.log("[WORKER API] payload inviato:", payload);

    // ===== VALIDAZIONE MINIMA =====
    if (!payload.action) {
      throw new Error("Action mancante nel payload");
    }

    // startManual è richiesto SOLO allo start
    if (
      payload.action === "start" &&
      (!payload.startManual || payload.startManual.length < 10)
    ) {
      throw new Error("Start manual mancante o vuoto");
    }

    // ===== CHIAMATA WORKER BACKEND =====
    const response = await fetch(WORKER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Risposta worker non valida");
    }

    const data = await response.json();
    console.log("[WORKER API] risposta worker:", data);

    // ===== VALIDAZIONE RISPOSTA =====
    if (
      !data ||
      typeof data !== "object" ||
      !data.narration ||
      !data.choices ||
      !data.choices.A ||
      !data.choices.B ||
      !data.choices.C
    ) {
      throw new Error("Struttura risposta non valida");
    }

    signalWorkerOK();
    return data;

  } catch (err) {
    console.error("[WORKER API] ERRORE:", err);
    signalWorkerError();

    // ===== FALLBACK =====
    return {
      narration:
        "Qualcosa va storto. Il mondo sembra osservarti in silenzio.",
      choices: {
        A: "Avanzare con cautela",
        B: "Cercare riparo",
        C: "Cambiare direzione"
      },
      _fallback: true,
      _error: err.message
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

/* ===== DEBUG ===== */
if (typeof DEBUG !== "undefined" && DEBUG) {
  console.log("[WORKER API] inizializzato (frontend bridge)");
}
