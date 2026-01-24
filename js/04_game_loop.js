/* ======================================================
   GAME LOOP — ORCHESTRAZIONE
   ====================================================== */

let awaitingInput = false;

/* ===== TURNO DI GIOCO ===== */
async function playTurn(action) {

  if (!awaitingInput && action !== "inizio") return;
  awaitingInput = false;

  if (DEBUG) {
    console.log("[LOOP] azione:", action);
  }

  // Stato di caricamento
  narrationEl.textContent = "Caricamento…";
  renderChoices({});
  clearTestBox?.();

  /* ===== PAYLOAD BASE ===== */
  const payload = {
    last_action: action,
    player_state: playerState,
    campaign_diary: campaignDiary,
    mission_diary: missionDiary
  };

  const data = await callWorker(payload);

  /* ======================================================
     INIZIALIZZAZIONE GIOCO (SOLO PRIMA RISPOSTA)
     ====================================================== */
  if (data.init && campaignDiary.inventario.length === 0) {

    const items = data.init.starting_items;

    if (items) {
      campaignDiary.inventario.push(
        items.weapon,
        items.tool,
        items.consumable
      );
    }

    // Salva location iniziale
    if (data.init.location) {
      missionDiary.currentLocation = data.init.location;
    }

    if (DEBUG) {
      console.log("[INIT] Location:", missionDiary.currentLocation);
      console.log("[INIT] Inventario:", campaignDiary.inventario);
    }

    // Render inventario iniziale
    renderInventory(campaignDiary.inventario);
  }

  /* ===== RENDER NARRAZIONE ===== */
  typeWriter(narrationEl, data.narration, 20, () => {
    awaitingInput = true;
  });

  /* ===== RENDER SCELTE ===== */
  renderChoices(data.choices);

  /* ===== AGGIORNA DIARIO MISSIONE ===== */
  missionDiary.log.push({
    turn: missionDiary.log.length + 1,
    narration: data.narration,
    choice: action
  });

  /* ===== FINE MISSIONE (PREPARAZIONE) ===== */
  if (data.mission_end === true) {
    if (DEBUG) {
      console.log("[MISSION] Prima missione conclusa — Hope Town trovata");
    }

    // Qui in futuro:
    // - aggiornamento campaignDiary
    // - passaggio a HUB
  }
}

/* ===== INPUT UTENTE ===== */
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
