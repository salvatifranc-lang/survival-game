/* ======================================================
   GAME LOOP — AVVIO PARTITA (START ONLY)
   ====================================================== */

async function initGame() {
  try {
    console.log("[04] initGame");

    // ===== CONTROLLO START MANUAL =====
    if (!window.START_MANUAL || window.START_MANUAL.length < 10) {
      throw new Error("START_MANUAL non disponibile");
    }

    console.log(
      "[04] startManual inviato al worker:",
      window.START_MANUAL.slice(0, 80) + "..."
    );

    // ===== CHIAMATA WORKER =====
    const result = await callWorker({
      startManual: window.START_MANUAL
    });

    console.log("[04] risposta dal worker:", result);

    // ===== RENDER UI =====
    renderStats(playerState);
    clearTestBox();

    typeWriter(narrationEl, result.narration, 18, () => {
      renderChoices(result.choices);
    });

  } catch (err) {
    console.error("[04] errore initGame:", err);

    // fallback visivo minimo
    narrationEl.textContent =
      "Errore critico durante l'inizializzazione del gioco.";
  }
}

/* ======================================================
   INPUT GIOCATORE (DEBUG)
   ====================================================== */

function handleChoice(choiceKey) {
  console.log("[04] scelta premuta:", choiceKey);

  // per ora solo debug
  narrationEl.innerHTML += `\n\n> Hai scelto: ${choiceKey}`;
}

/* ======================================================
   EVENT LISTENERS
   ====================================================== */

btnA.addEventListener("click", () => handleChoice("A"));
btnB.addEventListener("click", () => handleChoice("B"));
btnC.addEventListener("click", () => handleChoice("C"));

/* ======================================================
   AVVIO
   ====================================================== */

console.log("[04] inizializzato");
initGame();
