/* ======================================================
   GAME LOOP — FLUSSO BASE
   ====================================================== */

let awaitingInput = false;

/* ===== TURNO DI GIOCO ===== */
async function playTurn(action) {

  if (awaitingInput === false && action !== "inizio") return;
  awaitingInput = false;

  if (DEBUG) {
    console.log("[LOOP] azione:", action);
  }

  // Mostra stato di caricamento
  narrationEl.textContent = "Caricamento…";
  renderChoices({});

  // Payload MINIMO
  const payload = {
    last_action: action
  };

  const data = await callWorker(payload);

  // Render narrazione
  typeWriter(narrationEl, data.narration, 20, () => {
    awaitingInput = true;
  });

  // Render scelte
  renderChoices(data.choices);
}

/* ===== INPUT ===== */
btnA.onclick = () => playTurn("A");
btnB.onclick = () => playTurn("B");
btnC.onclick = () => playTurn("C");

/* ===== AVVIO GIOCO ===== */
playTurn("inizio");

/* ===== SEGNA FILE CARICATO ===== */
document.getElementById("led-loop")?.classList.add("ok");

/* ===== DEBUG ===== */
if (DEBUG) {
  console.log("[LOOP] inizializzato");
}
