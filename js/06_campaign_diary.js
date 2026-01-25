/* ======================================================
   06 — CAMPAIGN DIARY
   Memoria narrativa di lungo termine (campagna)
   ====================================================== */

/*
  RESPONSABILITÀ:
  - Contiene la sinossi canonica della storia
  - Tiene traccia dei grandi eventi della campagna
  - NON viene aggiornata a ogni turno
*/

/* ===== AVVIO CAMPAGNA ===== */
function initCampaignDiary() {
  if (!window.campaignDiary) {
    throw new Error("campaignDiary non definito nello state");
  }

  // Sinossi iniziale coerente con START MANUAL
  campaignDiary.synopsis = `
Anno 2095.

La superficie non è morta, ma è diventata ostile.
Le macchine autonome pattugliano le rovine senza sosta,
e chiunque osi muoversi all’aperto lo fa sapendo che potrebbe non tornare.

Tu sei un raider.
Vivi ai margini della sopravvivenza, muovendoti tra detriti, tunnel crollati
e cantieri abbandonati, recuperando ciò che resta del vecchio mondo.

Da tempo circolano voci su un luogo chiamato Hope Town:
un insediamento sotterraneo stabile, forse ancora libero dal controllo delle macchine.
Nessuno sa con certezza dove si trovi.
Alcuni dicono che sia solo un mito.

Tu sei fuori, sulla superficie, perché stai cercando la verità.
`;

  campaignDiary.keyEvents = [];
  campaignDiary.firstMissionCompleted = false;

  console.log("[CAMPAIGN DIARY] campagna inizializzata");
}

/* ===== EVENTI CHIAVE ===== */
function addCampaignEvent(event) {
  if (!campaignDiary) return;

  campaignDiary.keyEvents.push({
    turn: Date.now(),
    event
  });

  console.log("[CAMPAIGN DIARY] evento campagna aggiunto:", event);
}

/* ===== LETTURA PER AI (FUTURO) ===== */
function getCampaignSynopsis() {
  return campaignDiary?.synopsis || "";
}

/* ===== DEBUG ===== */
function printCampaignDiary() {
  if (!campaignDiary) {
    console.warn("[CAMPAIGN DIARY] non disponibile");
    return;
  }
  console.log("SINOSSI:", campaignDiary.synopsis);
  console.table(campaignDiary.keyEvents);
}

/* ===== ESPOSIZIONE GLOBALE ===== */
window.initCampaignDiary = initCampaignDiary;
window.addCampaignEvent = addCampaignEvent;
window.getCampaignSynopsis = getCampaignSynopsis;
window.printCampaignDiary = printCampaignDiary;

console.log("[CAMPAIGN DIARY] modulo inizializzato");
