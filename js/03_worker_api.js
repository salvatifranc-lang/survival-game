/* ======================================================
   WORKER API — COMUNICAZIONE SICURA
   ====================================================== */

/**
 * Chiama il worker e restituisce SEMPRE
 * un oggetto con:
 * - narration
 * - choices { A, B, C }
 */
async function callWorker(payload = {}) {

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    // Validazione minima
    if (
      !data ||
      typeof data.narration !== "string" ||
      !data.choices ||
      !data.choices.A ||
      !data.choices.B ||
      !data.choices.C
    ) {
      throw new Error("Risposta non valida");
    }

    signalWorkerOK();
    return data;

  } catch (err) {
    if (DEBUG) {
      console.error("[WORKER] errore o fallback", err);
    }

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

/* ===== LED HANDLERS ===== */
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

/* ===== SEGNA FILE CARICATO ===== */
document.getElementById("led-worker")?.classList.add("ok");

/* ===== DEBUG ===== */
if (typeof DEBUG !== "undefined" && DEBUG) {
  console.log("[WORKER_API] inizializzato");
}
