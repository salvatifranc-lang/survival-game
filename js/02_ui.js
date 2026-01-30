/* ======================================================
   UI — RENDER & DOM
   ====================================================== */

import { getLastRoll } from "./07_dice.js";

/* ======================================================
   DOM REFERENCES
   ====================================================== */
const statSalute   = document.getElementById("stat-salute");
const statStamina  = document.getElementById("stat-stamina");
const statLivello  = document.getElementById("stat-livello");
const statLocation = document.getElementById("stat-location");

const narrationEl  = document.getElementById("narration");
const choiceAEl    = document.getElementById("choiceA");
const choiceBEl    = document.getElementById("choiceB");
const choiceCEl    = document.getElementById("choiceC");

const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnC = document.getElementById("btnC");

const testBox     = document.getElementById("test-box");
const inventoryEl = document.getElementById("inventory-list");

/* ======================================================
   INPUT LOCK
   ====================================================== */
function setChoicesEnabled(enabled) {
  if (!btnA || !btnB || !btnC) return;
  btnA.disabled = !enabled;
  btnB.disabled = !enabled;
  btnC.disabled = !enabled;
}

/* ======================================================
   TYPEWRITER EFFECT (FAST + SAFE)
   ====================================================== */
function typeWriter(el, text, speed = 10, onDone) {
  if (!el) return;

  el.innerText = "";
  let i = 0;

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.textContent = "█";
  el.appendChild(cursor);

  const interval = setInterval(() => {
    if (i < text.length) {
      cursor.before(text.charAt(i));
      i++;
    } else {
      clearInterval(interval);
      cursor.remove();
      if (typeof onDone === "function") onDone();
    }
  }, speed);
}

/* ======================================================
   RENDER: NARRATION
   ====================================================== */
function renderNarration(text) {
  if (!text) return;

  setChoicesEnabled(false);

  typeWriter(narrationEl, text, 10, () => {
    setChoicesEnabled(true);
  });
}

/* ======================================================
   RENDER: STATS
   ====================================================== */
function renderStats(playerState, missionDiary) {
  if (!playerState) return;

  statSalute.textContent  = playerState.salute;
  statStamina.textContent = playerState.stamina;
  statLivello.textContent = playerState.livello;

  if (missionDiary?.location && statLocation) {
    statLocation.textContent = missionDiary.location;
  }
}

/* ======================================================
   RENDER: INVENTORY (WITH TOOLTIP)
   ====================================================== */
function renderInventory(inventory = []) {
  if (!inventoryEl) return;

  inventoryEl.innerHTML = "";

  if (!Array.isArray(inventory) || inventory.length === 0) {
    const empty = document.createElement("div");
    empty.textContent = "— vuoto —";
    empty.style.opacity = "0.6";
    inventoryEl.appendChild(empty);
    return;
  }

  inventory.forEach(item => {
    const div = document.createElement("div");
    div.className = "inventory-item";
    div.textContent = "• " + (item.name || item.id);

    if (item.description || item.tag || item.modifier != null) {
      div.dataset.tooltip = `
${item.description || ""}
${item.tag ? "Tag: " + item.tag : ""}
${item.modifier != null ? "Effetto: " + (item.modifier > 0 ? "+" : "") + item.modifier : ""}
      `.trim();
    }

    inventoryEl.appendChild(div);
  });
}

/* ======================================================
   RENDER: CHOICES (ANIMATE)
   ====================================================== */
function renderChoices(choices = {}) {
  choiceAEl.textContent = "";
  choiceBEl.textContent = "";
  choiceCEl.textContent = "";

  if (choices.A) typeWriter(choiceAEl, "A) " + choices.A, 4);
  if (choices.B) typeWriter(choiceBEl, "B) " + choices.B, 4);
  if (choices.C) typeWriter(choiceCEl, "C) " + choices.C, 4);
}

/* ======================================================
   RISK LABEL (UI ONLY)
   ====================================================== */
function riskLabel(risk) {
  switch (risk) {
    case 1: return "Minimo";
    case 2: return "Basso";
    case 3: return "Medio";
    case 4: return "Alto";
    case 5: return "Estremo";
    default: return "—";
  }
}

/* ======================================================
   TEST BOX — RESET
   ====================================================== */
function clearTestBox() {
  if (!testBox) return;

  testBox.innerHTML =
    `🎲 Dado: —<br>` +
    `⚠️ Rischio: —<br>` +
    `🏷️ Tipo: —<br>` +
    `🧰 Modificatore: —<br>` +
    `🧪 Esito: —`;
}

/* ======================================================
   TEST BOX — RENDER RESULT (WITH MODIFIER)
   ====================================================== */
function renderTestBox() {
  if (!testBox) return;

  const {
    roll,
    risk,
    tag,
    modifier,
    modifierSource,
    outcome
  } = getLastRoll();

  if (roll == null || risk == null || outcome == null) {
    clearTestBox();
    return;
  }

  let modifierLine = "—";

  if (modifier != null && modifierSource) {
    const sign = modifier > 0 ? "+" : "";
    modifierLine = `${sign}${modifier} (${modifierSource})`;
  }

  testBox.innerHTML =
    `🎲 Dado: <strong>${roll}</strong><br>` +
    `⚠️ Rischio: <strong>${riskLabel(risk)}</strong><br>` +
    `🏷️ Tipo: <strong>${tag || "—"}</strong><br>` +
    `🧰 Modificatore: <strong>${modifierLine}</strong><br>` +
    `🧪 Esito: <strong>${outcome}</strong>`;
}

/* ======================================================
   GLOBAL UI API
   ====================================================== */
window.renderNarration = renderNarration;
window.renderChoices   = renderChoices;
window.renderStats     = renderStats;
window.renderInventory = renderInventory;
window.clearTestBox    = clearTestBox;
window.renderTestBox   = renderTestBox;

/* ======================================================
   LED: UI OK
   ====================================================== */
document.getElementById("led-ui")?.classList.add("ok");

/* ======================================================
   DEBUG
   ====================================================== */
if (typeof DEBUG !== "undefined" && DEBUG) {
  console.log("[UI] inizializzata (d20 + risk + tag + modifier)");
}
