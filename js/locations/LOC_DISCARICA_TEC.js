export const LOC_DISCARICA_TEC = {
  id: "LOC_DISCARICA_TEC",
  name: "Discarica tecnologica",

  theme: "ammassi instabili di rottami, attività meccanica residua, pericolo costante",
  missionType: "recupero componenti e smantellamento mirato",

  entryRoom: "R1_MARGINE_DISCARICA",
  exitRooms: ["R10_USCITA_RIPULITA", "R10_USCITA_CAOTICA"],

  map: {
    rooms: {
      R1_MARGINE_DISCARICA: {
        id: "R1_MARGINE_DISCARICA",
        type: "ingresso",
        description: "Perimetro della discarica, colline di rottami e cavi scoperti",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R2_CUMULO_METALLI"],
          partial: ["R2_CUMULO_METALLI"],
          failure: ["R3_CANALONE_SCARTI"]
        }
      },

      R2_CUMULO_METALLI: {
        id: "R2_CUMULO_METALLI",
        type: "attraversamento",
        description: "Cumuli di metallo instabile, superfici taglienti",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        resources: {
          success: ["rottami_utili"]
        },

        transitions: {
          success: ["R4_NODO_MECCANICO"],
          partial: ["R4_NODO_MECCANICO", "R3_CANALONE_SCARTI"],
          failure: ["R3_CANALONE_SCARTI"]
        }
      },

      R3_CANALONE_SCARTI: {
        id: "R3_CANALONE_SCARTI",
        type: "pericolo",
        description: "Canalone di scarico con movimenti meccanici intermittenti",

        enemies: ["bracci_meccanici"],
        allowedTests: ["resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -2 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R4_NODO_MECCANICO"],
          partial: ["R5_AREA_COMPATTAMENTO"],
          failure: ["R5_AREA_COMPATTAMENTO"]
        }
      },

      R4_NODO_MECCANICO: {
        id: "R4_NODO_MECCANICO",
        type: "snodo",
        description: "Nodo di smistamento dei rottami, macchine obsolete",

        enemies: ["smistatore_autonomo"],
        allowedTests: ["tecnica", "furtività"],
        riskLevel: "medio",

        resources: {
          success: ["componenti_elettronici"],
          bonusSuccess: ["modulo_funzionale"]
        },

        transitions: {
          success: ["R6_AREA_SELEZIONE"],
          partial: ["R6_AREA_SELEZIONE", "R5_AREA_COMPATTAMENTO"],
          failure: ["R5_AREA_COMPATTAMENTO"]
        }
      },

      R5_AREA_COMPATTAMENTO: {
        id: "R5_AREA_COMPATTAMENTO",
        type: "pericolo",
        description: "Zona di compattamento con presse ancora attive",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R6_AREA_SELEZIONE"],
          partial: ["R7_PERCORSO_ELEVATO"],
          failure: ["R7_PERCORSO_ELEVATO"]
        }
      },

      R6_AREA_SELEZIONE: {
        id: "R6_AREA_SELEZIONE",
        type: "recupero",
        description: "Area di selezione manuale dei componenti",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        resources: {
          success: ["pezzi_recuperabili"],
          bonusSuccess: ["strumenti_smonto"]
        },

        transitions: {
          success: ["R8_TORRE_CONTROLLO"],
          partial: ["R8_TORRE_CONTROLLO"],
          failure: ["R7_PERCORSO_ELEVATO"]
        }
      },

      R7_PERCORSO_ELEVATO: {
        id: "R7_PERCORSO_ELEVATO",
        type: "attraversamento",
        description: "Percorso sopraelevato tra montagne di scarti",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R8_TORRE_CONTROLLO"],
          partial: ["R9_FRANA_SCARTI"],
          failure: ["R9_FRANA_SCARTI"]
        }
      },

      R8_TORRE_CONTROLLO: {
        id: "R8_TORRE_CONTROLLO",
        type: "conflitto",
        description: "Torre di controllo della discarica, sistemi ancora reattivi",

        enemies: ["IA_discarica"],
        allowedTests: ["tecnica", "furtività"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        resources: {
          success: ["sistemi_disattivati"]
        },

        transitions: {
          success: ["R10_USCITA_RIPULITA"],
          partial: ["R9_FRANA_SCARTI"],
          failure: ["R9_FRANA_SCARTI"]
        }
      },

      R9_FRANA_SCARTI: {
        id: "R9_FRANA_SCARTI",
        type: "pericolo",
        description: "Frana improvvisa di materiali tecnologici",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave", criticalFailure: "critica" },

        transitions: {
          success: ["R10_USCITA_CAOTICA"],
          partial: ["R10_USCITA_CAOTICA"],
          failure: ["R10_USCITA_CAOTICA"]
        }
      },

      R10_USCITA_RIPULITA: {
        id: "R10_USCITA_RIPULITA",
        type: "uscita",
        description: "Uscita con percorso relativamente sicuro e carico recuperato",

        transitions: {
          success: []
        }
      },

      R10_USCITA_CAOTICA: {
        id: "R10_USCITA_CAOTICA",
        type: "uscita",
        description: "Fuga disordinata tra rottami instabili",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: []
        }
      }
    },

    connections: {
      R1_MARGINE_DISCARICA: ["R2_CUMULO_METALLI", "R3_CANALONE_SCARTI"],
      R2_CUMULO_METALLI: ["R4_NODO_MECCANICO", "R3_CANALONE_SCARTI"],
      R3_CANALONE_SCARTI: ["R4_NODO_MECCANICO", "R5_AREA_COMPATTAMENTO"],
      R4_NODO_MECCANICO: ["R6_AREA_SELEZIONE", "R5_AREA_COMPATTAMENTO"],
      R5_AREA_COMPATTAMENTO: ["R6_AREA_SELEZIONE", "R7_PERCORSO_ELEVATO"],
      R6_AREA_SELEZIONE: ["R8_TORRE_CONTROLLO"],
      R7_PERCORSO_ELEVATO: ["R8_TORRE_CONTROLLO", "R9_FRANA_SCARTI"],
      R8_TORRE_CONTROLLO: ["R10_USCITA_RIPULITA", "R9_FRANA_SCARTI"],
      R9_FRANA_SCARTI: ["R10_USCITA_CAOTICA"]
    }
  }
}
