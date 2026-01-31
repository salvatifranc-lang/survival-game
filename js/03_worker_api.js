/* ======================================================
   WORKER API — FRONTEND BRIDGE
   (START / TURN / RESOLVE)
   ====================================================== */

import { DIFFICULTY_LEVELS, WORKER_ENDPOINT } from "./00_config.js";

/* ======================================================
   MAIN API
   ====================================================== */
export async function callWorker(payload = {}) {
  try {
    console.log("[WORKER API] payload inviato:", payload);

    /* ===== VALIDAZIONE INPUT ===== */
    if (!payload.action) {
      throw new Error("Action mancante nel payload");
    }

    if (
      payload.action === "start" &&
      (!payload.startManual || typeof payload.startManual !== "string")
    ) {
      throw new Error("Start manual mancante o non valido");
    }

    /* ===== CHIAMATA WORKER ===== */
    const response = await fetch(WORKER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Risposta HTTP non valida dal worker");
    }

    const data = await response.json();
    console.log("[WORKER API] risposta worker:", data);

    /* ==================================================
       SAFETY NET — EFFECTS SEMPRE PRESENTE
       ================================================== */
    if (!data.effects) {
      data.effects = {
        inventoryAdd: [],
        inventoryRemove: []
      };
    }

    /* ===== VALIDAZIONE PER ACTION ===== */
    switch (payload.action) {
      case "start":
        return validateStartResponse(data);

      case "turn":
        return validateTurnResponse(data);

      case "resolve":
        return validateResolveResponse(data);

      default:
        throw new Error("Action non supportata: " + payload.action);
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
  if (!data?.narration || !data?.choices) {
    throw new Error("Struttura risposta START non valida");
  }

  signalWorkerOK();
  return {
    narration: data.narration,
    choices: data.choices,
    effects: data.effects
  };
}

/**
 * TURN:
 * - può richiedere un test
 * - ora usa RISK + TAGS
 * - DEVE sempre propagare eventuali effects
 */
function validateTurnResponse(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Risposta TURN non valida");
  }

  /* ===== TEST RICHIESTO ===== */
  if (data.requiresTest === true) {
    let risk = Number(data.risk);

    if (![1, 2, 3, 4, 5].includes(risk)) {
      console.warn("[WORKER API] risk non valido, fallback a 3");
      risk = 3;
    }

    const tag =
  data.tag === null ||
  typeof data.tag === "number" ||
  typeof data.tag === "string"
    ? data.tag
    : null;

signalWorkerOK();
return {
  requiresTest: true,
  risk,
  tag,
  effects: data.effects
};

  }

  /* ===== NESSUN TEST ===== */
 // ===== NESSUN TEST (esplicito o implicito) =====
if (
  data.requiresTest !== true &&
  data.narration &&
  data.choices
) {
  signalWorkerOK();
  return {
    requiresTest: false,
    narration: data.narration,
    choices: data.choices,
    effects: data.effects
  };
}

}

/**
 * RESOLVE:
 * - riceve esito testuale
 * - restituisce narrazione + scelte
 * - DEVE propagare effects
 */
function validateResolveResponse(data) {
  if (!data?.narration || !data?.choices) {
    throw new Error("Struttura risposta RESOLVE non valida");
  }

  signalWorkerOK();
  return {
    narration: data.narration,
    choices: data.choices,
    effects: data.effects
  };
}

/* ======================================================
   FALLBACK
   ====================================================== */

function getFallbackResponse(action, errorMessage) {
  console.warn("[WORKER API] fallback:", action, errorMessage);

  return {
    requiresTest: false,
    narration:
      "Qualcosa va storto. Il mondo sembra osservarti in silenzio.",
    choices: {
      A: "Avanzare con cautela",
      B: "Cercare riparo",
      C: "Cambiare direzione"
    },
    effects: {
      inventoryAdd: [],
      inventoryRemove: []
    },
    _fallback: true,
    _error: errorMessage
  };
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
  console.log("[WORKER API] inizializzato");
}
