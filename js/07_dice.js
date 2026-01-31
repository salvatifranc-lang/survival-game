// 07_dice.js
// Gestione centralizzata del tiro di dado (d20), rischio, tag e modificatori

/* ======================================================
   STATO INTERNO
   ====================================================== */

// inventario corrente (sincronizzato da 04)
let currentInventory = [];

// Stato dell’ultimo tiro (leggibile da UI / debug)
let lastRollState = {
  roll: null,
  risk: null,
  tag: null,
  modifier: 0,
  modifierSource: null,
  effectiveRoll: null,
  outcome: null
};

/* ======================================================
   CONFIG TAG — CANONICA
   ====================================================== */

const TAG_MAP = {
  1: "scontro",
  2: "furtività",
  3: "tecnico",
  4: "percezione",
  5: "sopravvivenza",
  6: "resistenza"
};

function normalizeTag(tag) {
  if (Number.isInteger(tag) && TAG_MAP[tag]) {
    return TAG_MAP[tag];
  }

  if (typeof tag === "string" && Object.values(TAG_MAP).includes(tag)) {
    return tag;
  }

  return null;
}

/* ======================================================
   INVENTORY SYNC
   ====================================================== */

function setInventoryForDice(inventory = []) {
  currentInventory = Array.isArray(inventory) ? inventory : [];
  console.log("[DICE] inventario sincronizzato:", currentInventory);
}

/* ======================================================
   CONFIG BASE — RISK
   ====================================================== */

const RISK_THRESHOLDS = {
  1: 5,
  2: 8,
  3: 11,
  4: 14,
  5: 17
};

/* ======================================================
   DADO
   ====================================================== */

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

/* ======================================================
   MODIFICATORI DA INVENTARIO
   ====================================================== */

function calculateModifierFromInventory(tag) {
  let totalModifier = 0;
  const sources = [];

  if (!tag) return { totalModifier: 0, source: null };

  for (const item of currentInventory) {
    if (!item?.modifiers || typeof item.modifiers !== "object") continue;

    const value = item.modifiers[tag];
    if (typeof value === "number" && value !== 0) {
      totalModifier += value;
      sources.push(`${item.id} ${value > 0 ? "+" : ""}${value}`);
    }
  }

  return {
    totalModifier,
    source: sources.length > 0 ? sources.join(", ") : null
  };
}

/* ======================================================
   RISOLUZIONE ESITO
   ====================================================== */

function resolveOutcome(roll, effectiveRoll, risk) {
  if (!RISK_THRESHOLDS[risk]) {
    console.error("[DICE] Risk non valido:", risk);
    throw new Error("Risk non valido");
  }

  const threshold = RISK_THRESHOLDS[risk];

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

function performRoll(risk, tag = null) {
  const normalizedTag = normalizeTag(tag);

  const { totalModifier, source } =
    calculateModifierFromInventory(normalizedTag);

  console.log("[DICE] performRoll:", {
    risk,
    rawTag: tag,
    normalizedTag,
    totalModifier,
    source
  });

  const roll = rollD20();
  const effectiveRoll = roll + totalModifier;
  const outcome = resolveOutcome(roll, effectiveRoll, risk);

  lastRollState = {
    roll,
    risk,
    tag: normalizedTag,
    modifier: totalModifier,
    modifierSource: source,
    effectiveRoll,
    outcome
  };

  return { ...lastRollState };
}

/* ======================================================
   API DI LETTURA
   ====================================================== */

function getLastRoll() {
  return { ...lastRollState };
}

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
   EXPORT
   ====================================================== */

export {
  performRoll,
  getLastRoll,
  resetLastRoll,
  setInventoryForDice
};
