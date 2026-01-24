const WORKER_URL = "https://still-hat-5795.salvatifranc.workers.dev/";

/* ===== DOM ===== */
const narrationEl = document.getElementById("narration");
const choiceAEl   = document.getElementById("choiceA");
const choiceBEl   = document.getElementById("choiceB");
const choiceCEl   = document.getElementById("choiceC");

let turn = 0;

/* ===== CORE ===== */
async function callWorker(action) {
  narrationEl.textContent = "Caricamento...";

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        last_action: action,
        debug: true
      })
    });

    const data = await res.json();

    console.log("WORKER RESPONSE:", data);

    if (!data || !data.narration || !data.choices) {
      narrationEl.textContent = "Risposta non valida dal worker.";
      return;
    }

    narrationEl.textContent = data.narration;

    choiceAEl.textContent = "A) " + data.choices.A;
    choiceBEl.textContent = "B) " + data.choices.B;
    choiceCEl.textContent = "C) " + data.choices.C;

    turn++;

  } catch (e) {
    narrationEl.textContent = "Errore di comunicazione col worker.";
    console.error(e);
  }
}

/* ===== INPUT ===== */
function choose(letter) {
  callWorker(letter);
}

/* ===== START ===== */
callWorker("inizio");
