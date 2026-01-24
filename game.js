/* ======================================================
   CONFIG
   ====================================================== */
const WORKER_URL = "https://still-hat-5795.salvatifranc.workers.dev/";
const MANUAL_URL = "https://raw.githubusercontent.com/salvatifranc-lang/survival-game/main/HOPE_TOWN_GAME_MANUAL.txt";

/* ======================================================
   ITEM NAMES (TEMPORANEO)
   ====================================================== */
const ITEM_NAMES = {
  PISTOLA_SERV: "Pistola di servizio dismessa",
  TUNNEL_LAMP_FRAG: "Lampada da tunnel artigianale",
  RAZIONE_SECCA: "Razione alimentare secca",
  BATTERIA_USATA: "Batteria riutilizzata"
};

/* ======================================================
   DOM
   ====================================================== */
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

const testBox      = document.getElementById("test-box");
const inventoryEl  = document.getElementById("inventory-list");

/* ======================================================
   PLAYER
   ====================================================== */
let playerState = {
  salute: 10,
  stamina: 10,
  livello: 1
};

/* ======================================================
   CAMPAGNA (MEMORIA LUNGA)
   ====================================================== */
let campaignDiary = {
  synopsis: "Prima uscita in superficie.",
  inventario: [
    "PISTOLA_SERV",
    "TUNNEL_LAMP_FRAG",
    "RAZIONE_SECCA"
  ],
  abilita: []
};

/* ======================================================
   MISSIONE (MEMORIA BREVE)
   ====================================================== */
let missionDiary = {
  log: [],
  currentSituation: null
};

/* ======================================================
   MANUALE
   ====================================================== */
let gameManual = "";

/* ======================================================
   TURNO
   ====================================================== */
let lastResolution = null;
let awaitingInput = false;

/* ======================================================
   UI
   ====================================================== */
function updateStatsUI() {
  statSalute.textContent  = playerState.salute;
  statStamina.textContent = playerState.stamina;
  statLivello.textContent = playerState.livello;
}

function renderInventory() {
  inventoryEl.innerHTML = "";
  campaignDiary.inventario.forEach(id => {
    const div = document.createElement("div");
    div.textContent = "• " + (ITEM_NAMES[id] || id);
    inventoryEl.appendChild(div);
  });
}

function typeWriter(el, text, speed = 18) {
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
      awaitingInput = true;
    }
  }, speed);
}

/* ======================================================
   DADO
   ====================================================== */
function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function resolveTest(d6, difficulty) {
  const table = {
    "Estremo":        ["critical_fail","critical_fail","fail","fail","partial","success"],
    "Molto Rischioso":["critical_fail","fail","fail","partial","partial","success"],
    "Rischioso":     ["fail","fail","partial","partial","success","success"],
    "Standard":      ["fail","partial","partial","success","success","success"],
    "Facile":        ["partial","success","success","success","success","bonus"],
    "Molto Facile":  ["success","success","success","success","bonus","bonus"]
  };
  return table[difficulty][d6 - 1];
}

function esitoLabel(code) {
  return {
    critical_fail: "Fallimento Critico",
    fail: "Fallimento",
    partial: "Successo Parziale",
    success: "Successo",
    bonus: "Successo con Bonus"
  }[code];
}

/* ======================================================
   OGGETTI
   ====================================================== */
function handleExtraReward() {
  if (campaignDiary.inventario.length >= 6) return;
  campaignDiary.inventario.push("BATTERIA_USATA");
  renderInventory();
}

function handleCriticalFailure() {
  if (campaignDiary.inventario.length === 0) return;
  const lost =
    campaignDiary.inventario[Math.floor(Math.random() * campaignDiary.inventario.length)];
  campaignDiary.inventario =
    campaignDiary.inventario.filter(i => i !== lost);
  renderInventory();
}

/* ======================================================
   RISOLUZIONE
   ====================================================== */
function resolveSituation(situation) {
  const difficulty = situation?.difficulty || "Standard";
  const d6 = rollD6();
  const outcome = resolveTest(d6, difficulty);

  testBox.innerHTML =
    `🎲 Dado: ${d6}<br>` +
    `⚠️ Difficoltà: ${difficulty}<br>` +
    `🧪 Esito: ${esitoLabel(outcome)}`;

  if (outcome === "critical_fail") {
    playerState.salute -= 1;
    playerState.stamina -= 2;
    handleCriticalFailure();
  }
  else if (outcome === "fail") {
    playerState.stamina -= 2;
  }
  else if (outcome === "partial") {
    playerState.stamina -= 1;
  }
  else if (outcome === "bonus") {
    handleExtraReward();
  }

  updateStatsUI();
  return { d6, outcome };
}

/* ======================================================
   GAME LOOP (FIX COMPLETO)
   ====================================================== */
async function playTurn(action) {

  // 🔑 Consenti SEMPRE il primo turno
  if (missionDiary.log.length > 0 && !awaitingInput) return;
  awaitingInput = false;

  const missionStatePayload =
    missionDiary.log.length === 0 ? {} : { situation: missionDiary.currentSituation };

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_manual: gameManual,
        campaign_diary: campaignDiary,
        mission_state: missionStatePayload,
        player_state: playerState,
        last_resolution: lastResolution,
        last_action: action
      })
    });

    const data = await res.json();

    /* ===== GUARDIA ANTI-BLOCCO ===== */
    if (!data || !data.narration || !data.choices) {
      narrationEl.textContent =
        "Il segnale si interrompe. Qualcosa non va in superficie.";
      awaitingInput = true;
      return;
    }

    missionDiary.currentSituation = data.situation || null;

    typeWriter(narrationEl, data.narration, 20);

    setTimeout(() => {
      choiceAEl.textContent = "A) " + data.choices.A;
      choiceBEl.textContent = "B) " + data.choices.B;
      choiceCEl.textContent = "C) " + data.choices.C;
    }, 300);

    if (data.situation?.test === true) {
      lastResolution = resolveSituation(data.situation);
    } else {
      testBox.innerHTML =
        `🎲 Dado: —<br>` +
        `⚠️ Difficoltà: —<br>` +
        `🧪 Esito: —`;
      lastResolution = null;
    }

    missionDiary.log.push({
      narration: data.narration,
      choice: action,
      resolution: lastResolution
    });

  } catch {
    narrationEl.textContent =
      "Errore di comunicazione. Il mondo là fuori è silenzioso.";
    awaitingInput = true;
  }
}

/* ======================================================
   INPUT
   ====================================================== */
btnA.onclick = () => playTurn("A");
btnB.onclick = () => playTurn("B");
btnC.onclick = () => playTurn("C");

/* ======================================================
   INIT
   ====================================================== */
async function loadManual() {
  try {
    const res = await fetch(MANUAL_URL);
    gameManual = await res.text();
  } catch {
    gameManual = "";
  }
}

(async function init() {
  await loadManual();
  updateStatsUI();
  renderInventory();
  playTurn("inizio");
})();
