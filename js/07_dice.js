// 07_dice.js
// Gestione centralizzata del tiro di dado (d20), rischio e tag del test

/* ======================================================
   STATO INTERNO
   ====================================================== */

// Stato dell’ultimo tiro (leggibile da UI / debug)
let lastRollState = {
  roll: null,        // numero d20 (1–20)
  risk: null,        // livello di rischio (1–5)
  tags: [],          // array di tag del test
  outcome: null      // etichetta esito
};

/* ======================================================
   CONFIG BASE — RISK
   ====================================================== */

/**
 * Soglie base di fallimento in base al risk.
 * Il risk indica SOLO la probabilità di fallire,
 * NON la gravità delle conseguenze.
 *
 * Valore = soglia minima di SUCCESSO.
 * Se roll < soglia → fallimento.
 */
const RISK_THRESHOLDS = {
  1: 5,    // rischio minimo (quasi sicuro)
  2: 8,
  3: 11,
  4: 14,
  5: 17    // rischio estremo
};

/* ======================================================
   DADO
   ====================================================== */

/**
 * Lancia un dado a 20 facce
 * @returns {number} valore da 1 a 20
 */
function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

/* ======================================================
   RISOLUZIONE ESITO
   ====================================================== */

/**
 * Risolve l’esito del tiro in base a roll e risk.
 * I tag NON influenzano ancora il risultato (fase 1),
 * ma vengono salvati per UI, log e sviluppo futuro.
 *
 * @param {number} roll valore del dado (1–20)
 * @param {number} risk livello di rischio (1–5)
 * @returns {string} esito narrativo standardizzato
 */
function resolveOutcome(roll, risk) {
  if (!RISK_THRESHOLDS[risk]) {
    console.error("[DICE] Risk non valido:", risk);
    throw new Error("Risk non valido");
  }

  const successThreshold = RISK_THRESHOLDS[risk];

  // Critici (indipendenti dal risk)
  if (roll === 20) return "Successo Critico";
  if (roll === 1) return "Fallimento Critico";

  if (roll >= successThreshold + 5) return "Successo Totale";
  if (roll >= successThreshold) return "Successo Parziale";
  if (roll >= successThreshold - 3) return "Fallimento Controllato";

  return "Fallimento";
}

/* ======================================================
   TIRO COMPLETO
   ====================================================== */

/**
 * Esegue un tiro completo:
 * - d20
 * - risk (1–5)
 * - tag narrativi del test
 *
 * @param {number} risk livello di rischio (1–5)
 * @param {string[]} tags array di tag del test
 * @returns {{roll:number, risk:number, tags:string[], outcome:string}}
 */
function performRoll(risk, tags = []) {
  const roll = rollD20();
  const outcome = resolveOutcome(roll, risk);

  lastRollState = {
    roll,
    risk,
    tags: Array.isArray(tags) ? tags : [],
    outcome
  };

  return { ...lastRollState };
}

/* ======================================================
   API DI LETTURA
   ====================================================== */

/**
 * Restituisce l’ultimo tiro effettuato
 */
function getLastRoll() {
  return { ...lastRollState };
}

/**
 * Reset opzionale (nuova partita / debug)
 */
function resetLastRoll() {
  lastRollState = {
    roll: null,
    risk: null,
    tags: [],
    outcome: null
  };
}

/* ======================================================
   EXPORT PUBBLICI
   ====================================================== */

export {
  performRoll,
  getLastRoll,
  resetLastRoll
};
