// 07_dice.js
// Gestione centralizzata del tiro di dado e risoluzione dell’esito

import { DIFFICULTY_LEVELS, DICE_TABLE } from "./00_config.js";

// Stato interno dell’ultimo tiro (leggibile da UI o game loop)
let lastRollState = {
  roll: null,          // numero d6 (1–6)
  difficulty: null,    // stringa difficoltà
  outcome: null        // etichetta esito
};

/**
 * Lancia un dado a 6 facce
 * @returns {number} valore da 1 a 6
 */
function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Risolve l’esito in base a tiro e difficoltà
 * @param {number} roll valore del dado (1–6)
 * @param {string} difficulty una delle DIFFICULTY_LEVELS
 * @returns {string} etichetta di esito
 */
function resolveOutcome(roll, difficulty) {
  if (!DIFFICULTY_LEVELS.includes(difficulty)) {
    console.error("[DICE] Difficoltà non valida:", difficulty);
    throw new Error("Difficoltà non valida");
  }

  const table = DICE_TABLE[difficulty];
  if (!table || table.length !== 6) {
    console.error("[DICE] Tabella dado non valida per:", difficulty);
    throw new Error("Tabella dado mancante o errata");
  }

  // roll va da 1 a 6 → indice 0–5
  return table[roll - 1];
}

/**
 * Esegue un tiro completo (d6 + risoluzione)
 * @param {string} difficulty
 * @returns {{roll:number, difficulty:string, outcome:string}}
 */
function performRoll(difficulty) {
  const roll = rollD6();
  const outcome = resolveOutcome(roll, difficulty);

  lastRollState = {
    roll,
    difficulty,
    outcome
  };

  return { ...lastRollState };
}

/**
 * Restituisce l’ultimo tiro effettuato
 * (usato da UI / debug / log)
 */
function getLastRoll() {
  return { ...lastRollState };
}

/**
 * Reset opzionale (utile per nuova partita o test)
 */
function resetLastRoll() {
  lastRollState = {
    roll: null,
    difficulty: null,
    outcome: null
  };
}

// API pubblica del modulo
export {
  performRoll,
  getLastRoll,
  resetLastRoll
};
