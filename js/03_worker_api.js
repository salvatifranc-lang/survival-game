/* ======================================================
   WORKER API — SOLO START (DEBUG)
   ====================================================== */

async function callWorker(payload = {}) {
  try {
    console.log("[WORKER] payload ricevuto:", payload);

    // ===== CONTROLLI MINIMI =====
    if (!payload.startManual || payload.startManual.length < 10) {
      throw new Error("Start manual mancante o vuoto");
    }

    // ===== PROMPT RIGIDO =====
    const prompt = `
Sei il narratore di un gioco survival narrativo.

USA ESCLUSIVAMENTE il seguente MANUALE DI INIZIO GIOCO
per iniziare la partita.

MANUALE START:
"""
${payload.startManual}
"""

REGOLE FONDAMENTALI:
- Rispondi SOLO con JSON valido
- Nessun testo fuori dal JSON
- Nessun commento
- Nessun markdown

STRUTTURA OBBLIGATORIA DELLA RISPOSTA:

{
  "narration": "testo narrativo",
  "choices": {
    "A": "scelta A",
    "B": "scelta B",
    "C": "scelta C"
  }
}
`;

    // ===== CHIAMATA AI (Cloudflare Worker / fetch OpenAI) =====
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: "Rispondi solo in JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const raw = await response.json();
    console.log("[WORKER] risposta AI GREZZA:", raw);

    // ===== ESTRAZIONE TESTO =====
    const text =
      raw?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("Risposta AI vuota");
    }

    // ===== PARSE JSON =====
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("[WORKER] JSON non valido:", text);
      throw new Error("JSON non parsabile");
    }

    console.log("[WORKER] JSON parsato:", data);

    // ===== VALIDAZIONE STRUTTURA =====
    if (
      !data.narration ||
      !data.choices ||
      !data.choices.A ||
      !data.choices.B ||
      !data.choices.C
    ) {
      throw new Error("Struttura JSON non valida");
    }

    signalWorkerOK();
    return data;

  } catch (err) {
    console.error("[WORKER] ERRORE:", err);
    signalWorkerError();

    // ===== FALLBACK DI EMERGENZA =====
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
  console.log("[WORKER] inizializzato (start-only)");
}
