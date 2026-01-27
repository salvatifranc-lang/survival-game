export const LOC_METRO_COLLASSATA = {
  id: "LOC_METRO_COLLASSATA",
  name: "Stazione metropolitana collassata",

  theme: "sotterraneo instabile, acqua stagnante, pressione ambientale",
  missionType: "recupero e attraversamento",

  entryRoom: "R1_INGRESSO",
  exitRooms: ["R10_USCITA_STABILE", "R10_USCITA_EMERGENZA"],

  map: {
    rooms: {
      R1_INGRESSO: {
        id: "R1_INGRESSO",
        type: "ingresso",
        description: "Accesso crollato alla stazione, luce minima e detriti instabili",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        staminaEffects: { onEntry: -1 },

        resources: {
          success: ["materiali_comuni"]
        },

        transitions: {
          success: ["R2_BANCHINA"],
          partial: ["R2_BANCHINA"],
          failure: ["R3_TUNNEL_LATERALE"]
        }
      },

      R2_BANCHINA: {
        id: "R2_BANCHINA",
        type: "snodo",
        description: "Vecchia banchina allagata, binari sommersi",

        allowedTests: ["equilibrio", "percezione"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -1 },

        resources: {
          success: ["componenti_meccanici"]
        },

        transitions: {
          success: ["R4_GALLERIA"],
          partial: ["R4_GALLERIA", "R3_TUNNEL_LATERALE"],
          failure: ["R3_TUNNEL_LATERALE"]
        }
      },

      R3_TUNNEL_LATERALE: {
        id: "R3_TUNNEL_LATERALE",
        type: "pericolo",
        description: "Tunnel di servizio semi-collassato",

        allowedTests: ["resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -2 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R4_GALLERIA"],
          partial: ["R5_ALLAGAMENTO"],
          failure: ["R5_ALLAGAMENTO"]
        }
      },

      R4_GALLERIA: {
        id: "R4_GALLERIA",
        type: "attraversamento",
        description: "Galleria principale invasa da acqua stagnante",

        enemies: ["drone_pattuglia"],
        allowedTests: ["furtività", "resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        resources: {
          success: ["componenti_elettronici"],
          bonusSuccess: ["batteria_carica"]
        },

        transitions: {
          success: ["R6_SNODO_TECNICO"],
          partial: ["R5_ALLAGAMENTO"],
          failure: ["R5_ALLAGAMENTO"]
        }
      },

      R5_ALLAGAMENTO: {
        id: "R5_ALLAGAMENTO",
        type: "pericolo",
        description: "Zona completamente sommersa, visibilità nulla",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2, onFailure: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R6_SNODO_TECNICO"],
          partial: ["R7_CUNICOLI"],
          failure: ["R7_CUNICOLI"]
        }
      },

      R6_SNODO_TECNICO: {
        id: "R6_SNODO_TECNICO",
        type: "recupero",
        description: "Locale tecnico con pannelli danneggiati",

        allowedTests: ["tecnica", "percezione"],
        riskLevel: "basso",

        resources: {
          success: ["componenti_elettronici"],
          bonusSuccess: ["kit_riparazione"]
        },

        transitions: {
          success: ["R8_CONTROLLO"],
          partial: ["R8_CONTROLLO"],
          failure: ["R7_CUNICOLI"]
        }
      },

      R7_CUNICOLI: {
        id: "R7_CUNICOLI",
        type: "attraversamento",
        description: "Cunicoli stretti e instabili",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R8_CONTROLLO"],
          partial: ["R9_COLLASSO"],
          failure: ["R9_COLLASSO"]
        }
      },

      R8_CONTROLLO: {
        id: "R8_CONTROLLO",
        type: "conflitto",
        description: "Sala di controllo con sistemi ancora attivi",

        enemies: ["drone_sicurezza"],
        allowedTests: ["tecnica", "furtività"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        resources: {
          success: ["modulo_controllo"]
        },

        transitions: {
          success: ["R10_USCITA_STABILE"],
          partial: ["R9_COLLASSO"],
          failure: ["R9_COLLASSO"]
        }
      },

      R9_COLLASSO: {
        id: "R9_COLLASSO",
        type: "pericolo",
        description: "Cedimento strutturale improvviso",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave", criticalFailure: "critica" },

        transitions: {
          success: ["R10_USCITA_EMERGENZA"],
          partial: ["R10_USCITA_EMERGENZA"],
          failure: ["R10_USCITA_EMERGENZA"]
        }
      },

      R10_USCITA_STABILE: {
        id: "R10_USCITA_STABILE",
        type: "uscita",
        description: "Accesso secondario integro verso Hope Town",

        transitions: {
          success: []
        }
      },

      R10_USCITA_EMERGENZA: {
        id: "R10_USCITA_EMERGENZA",
        type: "uscita",
        description: "Ritorno forzato in superficie, esposto e pericoloso",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: []
        }
      }
    },

    connections: {
      R1_INGRESSO: ["R2_BANCHINA", "R3_TUNNEL_LATERALE"],
      R2_BANCHINA: ["R4_GALLERIA", "R3_TUNNEL_LATERALE"],
      R3_TUNNEL_LATERALE: ["R4_GALLERIA", "R5_ALLAGAMENTO"],
      R4_GALLERIA: ["R6_SNODO_TECNICO", "R5_ALLAGAMENTO"],
      R5_ALLAGAMENTO: ["R6_SNODO_TECNICO", "R7_CUNICOLI"],
      R6_SNODO_TECNICO: ["R8_CONTROLLO"],
      R7_CUNICOLI: ["R8_CONTROLLO", "R9_COLLASSO"],
      R8_CONTROLLO: ["R10_USCITA_STABILE", "R9_COLLASSO"],
      R9_COLLASSO: ["R10_USCITA_EMERGENZA"]
    }
  }
}
