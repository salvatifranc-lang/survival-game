/* ======================================================
   LOCATION SPECIALE — HOPE TOWN (HUB)
   ====================================================== */

export const LOC_HOPE_TOWN = {
  id: "LOC_HOPE_TOWN",
  name: "Hope Town",

  type: "hub",
  safeZone: true,
  persistent: true,

  description:
    "Un insediamento fortificato sorto tra le rovine della città. " +
    "Non è un paradiso, ma è l’unico luogo conosciuto dove le macchine " +
    "non pattugliano attivamente e la sopravvivenza è organizzata.",

  narrativeTone: {
    danger: "basso",
    tension: "latente",
    control: "alto"
  },

  features: {
    rest: {
      staminaRecovery: "full",   // ✅ MODIFICATO
      healthRecovery: "full",    // ✅ MODIFICATO
      description:
        "All’interno di Hope Town è possibile riposare senza minacce immediate. " +
        "Il recupero fisico è completo, ma il mondo esterno continua a muoversi."
    },

    inventoryManagement: true,
    preparationPhase: true,
    progressionAllowed: true
  },

  restrictions: {
    combatAllowed: false,
    randomEncounters: false,
    diceTests: false
  },

  workerGuidelines: {
    allowReflection: true,
    allowPlanning: true,
    allowNPCs: "neutrali_o_diffidenti",
    forbidImmediateThreats: true,
    forbidMissionResolution: true
  }
};
