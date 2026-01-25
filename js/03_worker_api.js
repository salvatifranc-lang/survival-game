/* ======================================================
   WORKER API — FRONTEND BRIDGE
   (START / TURN / RESOLVE)
   ====================================================== */

import { DIFFICULTY_LEVELS } from "./00_config.js";

async function callWorker(payload = {}) {
  try {
    console.log("[WORKER API] payload inviato:", payload);

    /* ==================================================
       VALIDAZIONE INPUT
       ================================================== */
    if (!payload.action) {
      throw new Error("Action mancante nel payload");
    }

    if (
      payload.action === "start" &&
      (!payload.startManual || payload.startManual.length < 10)
    ) {
      throw new Error("Start manual mancante o vuoto");
    }

    /* ==================================================
       CHIAMATA WORKER BACKEND
       ================================================== */
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

    /* ==================================================
       VALIDAZIONE RISPOSTA (PER ACTION)
       ================================================== */
    switch (payload.action) {
      case "start":
        return validateStartResponse(data);

      case "turn":
        return validateTurnResponse(data);

      case "resolve":
        return validateResolveResponse(data);

      default:
        throw new Error("Action non supportata");
    }

  } catch (err) {
    console.error("[WORKER API] ERRORE:", err);
    signalWorkerError();

    return getFallbackResponse(payload.action, err.message);
  }
}

/* ======================================================
   VALIDATORI
   ====================================================== */

function validateStartResponse(data) {
  if (
    !data ||
    typeof data !== "object" ||
    !data.narration ||
    !data.choices
  ) {
    throw new Error("Struttura risposta START non valida");
  }

  signalWorkerOK();
  return data;
}

/**
 * TURN:
 * - può richiedere un test
 * - oppure restituire direttamente narrazione + scelte
 */
function validateTurnResponse(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Risposta TURN non valida");
  }

  // ===== CASO: TEST RICHIESTO =====
  if (data.requiresTest === true) {
    if (!DIFFICULTY_LEVELS.includes(data.difficulty)) {
      console.warn(
        "[WORKER API] difficoltà non valida, fallback a Standard"
      );
      data.difficulty = "Standard";
    }

    signalWorkerOK();
    return {
      requiresTest: true,
      difficulty: data.difficulty
    };
  }

  // ===== CASO: NESSUN TEST =====
  if (
    data.requiresTest === false &&
    data.narration &&
    data.choices
  ) {
    signalWorkerOK();
    return {
      requiresTest: false,
      narration: data.narration,
      choices: data.choices
    };
  }

  throw new Error("Struttura TURN non riconosciuta");
}

/**
 * RESOLVE:
 * - riceve esito testuale
 * - restituisce narrazione + scelte
 */
function validateResolveResponse(data) {
  if (
    !data ||
    typeof data !== "object" ||
    !data.narration ||
    !data.choices
  ) {
    throw new Error("Struttura risposta RESOLVE non valida");
  }

  signalWorkerOK();
  return data;
}

/* ======================================================
   FALLBACK
   ====================================================== */

function getFallbackResponse(action, errorMessage) {
  console.warn("[WORKER API] fallback attivato:", action, errorMessage);

  switch (action) {
    case "turn":
    case "resolve":
      return {
        requiresTest: false,
        narration:
          "Qualcosa va storto. Il mondo sembra osservarti in silenzio.",
        choices: {
          A: "Avanzare con cautela",
          B: "Cercare riparo",
          C: "Cambiare direzione"
        },
        _fallback: true,
        _error: errorMessage
      };

    case "start":
    default:
      return {
        narration:
          "Ti risvegli in un mondo ostile, dove ogni scelta potrebbe essere l’ultima.",
        choices: {
          A: "Osservare l’ambiente",
          B: "Muoversi lentamente",
          C: "Restare immobile"
        },
        _fallback: true,
        _error: errorMessage
      };
  }
}

/* ======================================================
   LED
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

/* ======================================================
   DEBUG
   ====================================================== */
if (typeof DEBUG !== "undefined" && DEBUG) {
  console.log("[WORKER API] inizializzato (frontend bridge)");
}

export { callWorker };
