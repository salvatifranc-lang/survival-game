/* ======================================================
   WORKER API — FRONTEND BRIDGE (START ONLY)
   ====================================================== */

async function callWorker(payload = {}) {
  try {
    console.log("[WORKER API] payload inviato:", payload);

    // ===== CONTROLLO MINIMO =====
    if (!payload.startManual || payload.startManual.length < 10) {
      throw new Error("Start manual mancante o vuoto");
    }

    // ===== CHIAMATA AL WORKER BACKEND =====
    // ⚠️ QUESTO È IL TUO ENDPOINT CLOUDFLARE WORKER
    const response = await fetch(WORKER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "start",
        startManual: payload.startManual
      })
    });

    if (!response.ok) {
      throw new Error("Risposta worker non valida");
    }

    const data = await response.json();
    console.log("[WORKER API] risposta worker:", data);

    // ===== VALIDAZIONE STRUTTURA =====
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
        "Ti risvegli in un luogo ostile. L’aria è immobile, il silenzio innaturale. Restare fermo non è un’opzione.",
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

/* ===== DEBUG ===== */
if (typeof DEBUG !== "undefined" && DEBUG) {
  console.log("[WORKER API] inizializzato (frontend bridge)");
}
