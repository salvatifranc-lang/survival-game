/* ======================================================
   UI — RENDER & DOM
   ====================================================== */

/* ===== DOM REFERENCES ===== */
const statSalute   = document.getElementById("stat-salute");
const statStamina  = document.getElementById("stat-stamina");
const statLivello  = document.getElementById("stat-livello");

const narrationEl  = document.getElementById("narration");
const choiceAEl    = document.getElementById("choiceA");
const choiceBEl    = document.getElementById("choiceB");
const choiceCEl    = document.getElementById("choiceC");

const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnC = document.getElementById("btnC");

const testBox     = document.getElementById("test-box");
const inventoryEl = document.getElementById("inventory-list");

/* ===== TYPEWRITER ===== */
function typeWriter(el, text, speed = 18, onDone) {
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

/* ===== RENDER: STATS ===== */
function renderStats(playerState) {
  if (!playerState) return;
  statSalute.textContent  = playerState.salute;
  statStamina.textContent = playerState.stamina;
  statLivello.textContent = playerState.livello;
}

/* ===== RENDER: INVENTORY ===== */
function renderInventory(inventory = [], nameMap = {}) {
  inventoryEl.innerHTML = "";
  inventory.forEach(id => {
    const div = document.createElement("div");
    div.textContent = "• " + (nameMap[id] || id);
    inventoryEl.appendChild(div);
  });
}

/* ===== RENDER: CHOICES ===== */
function renderChoices(choices) {
  choiceAEl.textContent = choices?.A ? "A) " + choices.A : "";
  choiceBEl.textContent = choices?.B ? "B) " + choices.B : "";
  choiceCEl.textContent = choices?.C ? "C) " + choices.C : "";
}

/* ===== RENDER: TEST BOX ===== */
function clearTestBox() {
  testBox.innerHTML =
    `🎲 Dado: —<br>` +
    `⚠️ Difficoltà: —<br>` +
    `🧪 Esito: —`;
}

/* ===== SEGNA FILE CARICATO ===== */
document.getElementById("led-ui")?.classList.add("ok");

/* ===== DEBUG ===== */
if (typeof DEBUG !== "undefined" && DEBUG) {
  console.log("[UI] inizializzata");
}
