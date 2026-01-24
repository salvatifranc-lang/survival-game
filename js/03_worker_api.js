/* ======================================================
   WORKER API — Comunicazione sicura con Cloudflare Worker
   ====================================================== */

async function callWorker(payload = {}) {

  try {
    if (DEBUG) {
      console.log("[WORKER] invio payload", payload);
    }

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // 🔍 leggiamo SEMPRE come testo (mai res.json diretto)
    const rawText = await res.text();

    if (DEBUG) {
      console.log("[WORKER] risposta grezza:", rawText);
    }

    // Tentativo di estrazione JSON
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {

      // 🔧 Tentativo di recupero JSON da testo sporco
      const jsonMatch = rawText.match(/\{[\s\S]*\}$/);

      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("JSON non recuperabile");
      }
    }

    // Validazione minima
    if (
      !data ||
      typeof data.narration !== "string" ||
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

    if (DEBUG) {
      console.error("[WORKER] errore o fallback", err);
    }

    signalWorkerError();

    // 🛟 FALLBACK SICURO (mai blocca il gioco)
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

/* ======================================================
   LED HANDLERS
   ====================================================== */

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
