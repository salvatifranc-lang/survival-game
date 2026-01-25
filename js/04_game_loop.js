/* ======================================================
   04 — GAME LOOP (START ONLY)
   ====================================================== */

async function callWorkerStart(startManual) {
  try {
    console.log("[04] startManual inviato al worker:", startManual);

    if (!startManual || startManual.length < 10) {
      throw new Error("startManual mancante o vuoto (frontend)");
    }

    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        startManual: startManual
      })
    });

    if (!response.ok) {
      throw new Error("Worker response not OK");
    }

    const data = await response.json();
    console.log("[04] risposta dal worker:", data);

    if (
      !data ||
      typeof data.narration !== "string" ||
      !data.choices ||
      !data.choices.A ||
      !data.choices.B ||
      !data.choices.C
    ) {
      throw new Error("Risposta worker non valida");
    }

    return data;

  } catch (err) {
    console.error("[04] ERRORE callWorkerStart:", err);

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

/* ===== AVVIO PARTITA ===== */
async function initGame() {
  console.log("[04] initGame");

  const startManual = window.START_MANUAL;

  const result = await callWorkerStart(startManual);

  // 👉 UI
  renderStats(playerState);
  typeWriter(narrationEl, result.narration);
  renderChoices(result.choices);
  clearTestBox();
}

/* ===== BOOT ===== */
document.getElementById("led-loop")?.classList.add("ok");

if (typeof DEBUG !== "undefined" && DEBUG) {
  console.log("[04] inizializzato");
}
