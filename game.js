/* ======================================================
   CONFIG
   ====================================================== */
const WORKER_URL = "https://still-hat-5795.salvatifranc.workers.dev/";
const MANUAL_URL = "https://raw.githubusercontent.com/salvatifranc-lang/survival-game/main/HOPE_TOWN_GAME_MANUAL.txt";

/* ======================================================
   DOM (UI ONLY)
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
   PLAYER STATE
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
    "PISTOLA_SERV",     // 1 arma
    "TUNNEL_LAMP_FRAG", // 1 oggetto stabile
    "RAZIONE_SECCA"     // 1 consumabile
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
   STATO TURNO
   ====================================================== */
let lastResolution = null;
let awaitingInput = false;

/* ======================================================
   UI HELPERS
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
    div.textContent = "• " + id;
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
   DADO (COERENTE COL MANUALE)
   ====================================================== */
function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function resolveTest(d6, difficulty) {
  const table = {
    "Estremo": [
      { outcome: "critical_fail" },
      { outcome: "critical_fail" },
      { outcome: "fail" },
      { outcome: "fail" },
      { outcome: "partial" },
      { outcome: "success" }
    ],
    "Molto Rischioso": [
      { outcome: "critical_fail" },
      { outcome: "fail" },
      { outcome: "fail" },
      { outcome: "partial" },
      { outcome: "partial" },
      { outcome: "success" }
    ],
    "Rischioso": [
      { outcome: "fail" },
      { outcome: "fail" },
      { outcome: "partial" },
      { outcome: "partial" },
      { outcome: "success" },
      { outcome: "success" }
    ],
    "Standard": [
      { outcome: "fail" },
      { outcome: "partial" },
      { outcome: "partial" },
      { outcome: "success" },
      { outcome: "success" },
      { outcome: "success" }
    ],
    "Facile": [
      { outcome: "partial" },
      { outcome: "success" },
      { outcome: "success" },
      { outcome: "success" },
      { outcome: "success" },
      { outcome: "success", extra: true }
    ],
    "Molto Facile": [
      { outcome: "success" },
      { outcome: "success" },
      { outcome: "success" },
      { outcome: "success" },
      { outcome: "success", extra: true },
      { outcome: "success", extra: true }
    ]
  };

  return table[difficulty][d6 - 1];
}

function esitoLabel(code) {
  return {
    critical_fail: "Fallimento Critico",
    fail: "Fallimento",
    partial: "Successo Parziale",
    success: "Successo"
  }[code];
}

/* ======================================================
   RISCHIO & DIFFICOLTÀ (SOLO METADATI)
   ====================================================== */
function shouldTest(situation) {
  if (!situation) return false;
  if (situation.threats.length === 0) return false;
  if (situation.pressure === "alta") return true;
  if (playerState.stamina <= 3) return true;
  return false;
}

function determineDifficulty(situation) {
  let score = 0;
  if (situation.threats.length >= 2) score++;
  if (situation.pressure === "alta") score++;
  if (situation.visibility === "scarsa") score++;
  if (situation.visibility === "nulla") score += 2;
  if (playerState.stamina <= 3) score++;

  if (score <= 1) return "Facile";
  if (score === 2) return "Standard";
  if (score === 3) return "Rischioso";
  if (score === 4) return "Molto Rischioso";
  return "Estremo";
}

/* ======================================================
   RISOLUZIONE SITUAZIONE
   ====================================================== */
function resolveSituation(situation) {
  const difficulty = determineDifficulty(situation);
  const d6 = rollD6();
  const result = resolveTest(d6, difficulty);

  testBox.innerHTML =
    `🎲 Dado: ${d6}<br>` +
    `⚠️ Difficoltà: ${difficulty}<br>` +
    `🧪 Esito: ${esitoLabel(result.outcome)}`;

  if (result.outcome === "critical_fail") {
    playerState.salute -= 1;
    playerState.stamina -= 2;
    handleCriticalFailure();
  }
  else if (result.outcome === "fail") {
    playerState.stamina -= 2;
  }
  else if (result.outcome === "partial") {
    playerState.stamina -= 1;
  }
  else if (result.extra === true) {
    handleExtraReward();
  }

  updateStatsUI();
  return { difficulty, d6, outcome: result.outcome };
}

/* ======================================================
   OGGETTI: RICOMPENSE & ROTTURE (BASE)
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
   GAME LOOP
   ====================================================== */
async function playTurn(action) {
  if (!awaitingInput) return;
  awaitingInput = false;

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_manual: gameManual,
        campaign_diary: campaignDiary,
        mission_state: { situation: missionDiary.currentSituation },
        player_state: playerState,
        last_resolution: lastResolution,
        last_action: action
      })
    });

    const data = await res.json();

    missionDiary.currentSituation = data.situation;
    typeWriter(narrationEl, data.narration, 20);

    setTimeout(() => {
      choiceAEl.textContent = "A) " + data.choices.A;
      choiceBEl.textContent = "B) " + data.choices.B;
      choiceCEl.textContent = "C) " + data.choices.C;
    }, 300);

    if (shouldTest(data.situation)) {
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
      situation: data.situation,
      resolution: lastResolution
    });

  } catch {
    narrationEl.textContent = "Errore di comunicazione.";
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
