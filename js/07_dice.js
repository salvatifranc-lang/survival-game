// 07_dice.js
// Gestione centralizzata del tiro di dado (d20), rischio, tag e modificatori

/* ======================================================
   STATO INTERNO
   ====================================================== */

// Stato dell’ultimo tiro (leggibile da UI / debug)
let lastRollState = {
  roll: null,            // numero d20 (1–20)
  risk: null,            // livello di rischio (1–5)
  tag: null,             // singolo tag del test
  modifier: 0,           // modificatore totale applicato
  modifierSource: null,  // fonte del modificatore (oggetto / abilità)
  effectiveRoll: null,   // roll + modifier
  outcome: null          // etichetta esito
};

/* ======================================================
   CONFIG BASE — RISK
   ====================================================== */

/**
 * Soglie base di successo in base al risk.
 * Il risk indica SOLO la probabilità di fallire,
 * NON la gravità delle conseguenze.
 */
const RISK_THRESHOLDS = {
  1: 5,    // rischio minimo
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
 * Risolve l’esito del tiro.
 * I critici dipendono SOLO dal dado puro.
 */
function resolveOutcome(roll, effectiveRoll, risk) {
  if (!RISK_THRESHOLDS[risk]) {
    console.error("[DICE] Risk non valido:", risk);
    throw new Error("Risk non valido");
  }

  const threshold = RISK_THRESHOLDS[risk];

  // Critici (indipendenti dai modificatori)
  if (roll === 20) return "Successo Critico";
  if (roll === 1) return "Fallimento Critico";

  if (effectiveRoll >= threshold + 5) return "Successo Totale";
  if (effectiveRoll >= threshold) return "Successo Parziale";
  if (effectiveRoll >= threshold - 3) return "Fallimento Controllato";

  return "Fallimento";
}

/* ======================================================
   TIRO COMPLETO
   ====================================================== */

/**
 * Esegue un tiro completo:
 * - d20
 * - risk (1–5)
 * - singolo tag del test
 * - modificatore (oggetti / abilità / stato)
 *
 * @param {number} risk livello di rischio (1–5)
 * @param {string|null} tag singolo tag del test
 * @param {number} modifier modificatore numerico
 * @param {string|null} modifierSource descrizione della fonte del bonus/malus
 * @returns {{
 *   roll:number,
 *   risk:number,
 *   tag:string|null,
 *   modifier:number,
 *   modifierSource:string|null,
 *   effectiveRoll:number,
 *   outcome:string
 * }}
 */
function performRoll(risk, tag = null, modifier = 0, modifierSource = null) {
  const roll = rollD20();
  const safeModifier = Number(modifier) || 0;
  const effectiveRoll = roll + safeModifier;

  const outcome = resolveOutcome(roll, effectiveRoll, risk);

  lastRollState = {
    roll,
    risk,
    tag,
    modifier: safeModifier,
    modifierSource,
    effectiveRoll,
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
    tag: null,
    modifier: 0,
    modifierSource: null,
    effectiveRoll: null,
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
