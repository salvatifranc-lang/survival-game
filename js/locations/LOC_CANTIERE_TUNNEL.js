export const LOC_CANTIERE_TUNNEL = {
  id: "LOC_CANTIERE_TUNNEL",
  name: "Cantiere di scavo incompiuto",

  theme: "struttura sotterranea instabile, scavi interrotti, macchine autonome",
  missionType: "apertura passaggi e ispezione strutturale",

  entryRoom: "R1_PIAZZALE_CANTIERE",
  exitRooms: ["R10_USCITA_STABILE", "R10_USCITA_CROLLATA"],

  map: {
    rooms: {
      R1_PIAZZALE_CANTIERE: {
        id: "R1_PIAZZALE_CANTIERE",
        type: "ingresso",
        description: "Piazzale del cantiere, mezzi abbandonati e luci di segnalazione",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R2_GALLERIA_INIZIALE"],
          partial: ["R2_GALLERIA_INIZIALE"],
          failure: ["R3_PENDIO_INSTABILE"]
        }
      },

      R2_GALLERIA_INIZIALE: {
        id: "R2_GALLERIA_INIZIALE",
        type: "attraversamento",
        description: "Galleria di accesso con supporti provvisori",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R4_CAMERA_SCAVO"],
          partial: ["R4_CAMERA_SCAVO", "R3_PENDIO_INSTABILE"],
          failure: ["R3_PENDIO_INSTABILE"]
        }
      },

      R3_PENDIO_INSTABILE: {
        id: "R3_PENDIO_INSTABILE",
        type: "pericolo",
        description: "Pendio di detriti pronti a cedere",

        allowedTests: ["resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R4_CAMERA_SCAVO"],
          partial: ["R5_TUNNEL_LATERALE"],
          failure: ["R5_TUNNEL_LATERALE"]
        }
      },

      R4_CAMERA_SCAVO: {
        id: "R4_CAMERA_SCAVO",
        type: "snodo",
        description: "Camera principale con macchine da scavo ferme",

        enemies: ["scavatrice_autonoma"],
        allowedTests: ["furtività", "tecnica"],
        riskLevel: "medio",

        resources: {
          success: ["componenti_pesanti"],
          bonusSuccess: ["carburante"]
        },

        transitions: {
          success: ["R6_CONDOTTO_SUPPORTO"],
          partial: ["R6_CONDOTTO_SUPPORTO", "R5_TUNNEL_LATERALE"],
          failure: ["R5_TUNNEL_LATERALE"]
        }
      },

      R5_TUNNEL_LATERALE: {
        id: "R5_TUNNEL_LATERALE",
        type: "attraversamento",
        description: "Tunnel secondario stretto e irregolare",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R6_CONDOTTO_SUPPORTO"],
          partial: ["R7_FRANA"],
          failure: ["R7_FRANA"]
        }
      },

      R6_CONDOTTO_SUPPORTO: {
        id: "R6_CONDOTTO_SUPPORTO",
        type: "recupero",
        description: "Condotto di supporto con rinforzi strutturali",

        allowedTests: ["tecnica"],
        riskLevel: "basso",

        resources: {
          success: ["puntelli"],
          bonusSuccess: ["schema_strutturale"]
        },

        transitions: {
          success: ["R8_CENTRO_COMANDO"],
          partial: ["R8_CENTRO_COMANDO"],
          failure: ["R7_FRANA"]
        }
      },

      R7_FRANA: {
        id: "R7_FRANA",
        type: "pericolo",
        description: "Frana improvvisa che blocca il passaggio",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R8_CENTRO_COMANDO"],
          partial: ["R9_COLLASSO_TOTALE"],
          failure: ["R9_COLLASSO_TOTALE"]
        }
      },

      R8_CENTRO_COMANDO: {
        id: "R8_CENTRO_COMANDO",
        type: "conflitto",
        description: "Centro di comando del cantiere con sistemi automatici",

        enemies: ["sistema_scavo"],
        allowedTests: ["tecnica", "furtività"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        resources: {
          success: ["controlli_scavo"]
        },

        transitions: {
          success: ["R10_USCITA_STABILE"],
          partial: ["R9_COLLASSO_TOTALE"],
          failure: ["R9_COLLASSO_TOTALE"]
        }
      },

      R9_COLLASSO_TOTALE: {
        id: "R9_COLLASSO_TOTALE",
        type: "pericolo",
        description: "Collasso strutturale dell’area di scavo",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave", criticalFailure: "critica" },

        transitions: {
          success: ["R10_USCITA_CROLLATA"],
          partial: ["R10_USCITA_CROLLATA"],
          failure: ["R10_USCITA_CROLLATA"]
        }
      },

      R10_USCITA_STABILE: {
        id: "R10_USCITA_STABILE",
        type: "uscita",
        description: "Uscita rinforzata che conduce a Hope Town",

        transitions: {
          success: []
        }
      },

      R10_USCITA_CROLLATA: {
        id: "R10_USCITA_CROLLATA",
        type: "uscita",
        description: "Rientro difficoltoso attraverso passaggi parzialmente crollati",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: []
        }
      }
    },

    connections: {
      R1_PIAZZALE_CANTIERE: ["R2_GALLERIA_INIZIALE", "R3_PENDIO_INSTABILE"],
      R2_GALLERIA_INIZIALE: ["R4_CAMERA_SCAVO", "R3_PENDIO_INSTABILE"],
      R3_PENDIO_INSTABILE: ["R4_CAMERA_SCAVO", "R5_TUNNEL_LATERALE"],
      R4_CAMERA_SCAVO: ["R6_CONDOTTO_SUPPORTO", "R5_TUNNEL_LATERALE"],
      R5_TUNNEL_LATERALE: ["R6_CONDOTTO_SUPPORTO", "R7_FRANA"],
      R6_CONDOTTO_SUPPORTO: ["R8_CENTRO_COMANDO"],
      R7_FRANA: ["R8_CENTRO_COMANDO", "R9_COLLASSO_TOTALE"],
      R8_CENTRO_COMANDO: ["R10_USCITA_STABILE", "R9_COLLASSO_TOTALE"],
      R9_COLLASSO_TOTALE: ["R10_USCITA_CROLLATA"]
    }
  }
}
