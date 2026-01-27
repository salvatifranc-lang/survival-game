export const LOC_QUARTIERE_SOMMERSO = {
  id: "LOC_QUARTIERE_SOMMERSO",
  name: "Quartiere residenziale sommerso",

  theme: "zona urbana allagata, visibilità ridotta, minacce nascoste",
  missionType: "ricerca e tracciamento",

  entryRoom: "R1_PUNTO_ACCESSO",
  exitRooms: ["R10_USCITA_SICURA", "R10_USCITA_ISOLATA"],

  map: {
    rooms: {
      R1_PUNTO_ACCESSO: {
        id: "R1_PUNTO_ACCESSO",
        type: "ingresso",
        description: "Ingresso al quartiere sommerso, acqua torbida fino alle ginocchia",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R2_STRADA_ALLAGATA"],
          partial: ["R2_STRADA_ALLAGATA"],
          failure: ["R3_CORTILE_INTERNO"]
        }
      },

      R2_STRADA_ALLAGATA: {
        id: "R2_STRADA_ALLAGATA",
        type: "attraversamento",
        description: "Strada principale sommersa, detriti e veicoli abbandonati",

        allowedTests: ["equilibrio", "percezione"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },

        resources: {
          success: ["scorte_cibo"]
        },

        transitions: {
          success: ["R4_EDIFICIO_RESIDENZIALE"],
          partial: ["R4_EDIFICIO_RESIDENZIALE", "R3_CORTILE_INTERNO"],
          failure: ["R3_CORTILE_INTERNO"]
        }
      },

      R3_CORTILE_INTERNO: {
        id: "R3_CORTILE_INTERNO",
        type: "pericolo",
        description: "Cortile interno completamente sommerso, accessi multipli",

        enemies: ["movimenti_sommersi"],
        allowedTests: ["resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -2 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R4_EDIFICIO_RESIDENZIALE"],
          partial: ["R5_PIANO_TERRA"],
          failure: ["R5_PIANO_TERRA"]
        }
      },

      R4_EDIFICIO_RESIDENZIALE: {
        id: "R4_EDIFICIO_RESIDENZIALE",
        type: "snodo",
        description: "Palazzo residenziale con piani inferiori allagati",

        allowedTests: ["percezione"],
        riskLevel: "medio",

        transitions: {
          success: ["R6_APPARTAMENTO"],
          partial: ["R6_APPARTAMENTO", "R5_PIANO_TERRA"],
          failure: ["R5_PIANO_TERRA"]
        }
      },

      R5_PIANO_TERRA: {
        id: "R5_PIANO_TERRA",
        type: "pericolo",
        description: "Piano terra sommerso, correnti imprevedibili",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R6_APPARTAMENTO"],
          partial: ["R7_TETTI"],
          failure: ["R7_TETTI"]
        }
      },

      R6_APPARTAMENTO: {
        id: "R6_APPARTAMENTO",
        type: "recupero",
        description: "Appartamento abbandonato, oggetti personali sparsi",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        resources: {
          success: ["scorte_mediche"],
          bonusSuccess: ["radio_portatile"]
        },

        transitions: {
          success: ["R8_TORRE_RIPETITORE"],
          partial: ["R8_TORRE_RIPETITORE"],
          failure: ["R7_TETTI"]
        }
      },

      R7_TETTI: {
        id: "R7_TETTI",
        type: "attraversamento",
        description: "Passaggio sui tetti instabili, vento e pioggia battente",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R8_TORRE_RIPETITORE"],
          partial: ["R9_CROLLO"],
          failure: ["R9_CROLLO"]
        }
      },

      R8_TORRE_RIPETITORE: {
        id: "R8_TORRE_RIPETITORE",
        type: "conflitto",
        description: "Torre di ripetizione radio sommersa alla base",

        enemies: ["sistemi_attivi"],
        allowedTests: ["tecnica", "resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        resources: {
          success: ["segnale_tracciato"]
        },

        transitions: {
          success: ["R10_USCITA_SICURA"],
          partial: ["R9_CROLLO"],
          failure: ["R9_CROLLO"]
        }
      },

      R9_CROLLO: {
        id: "R9_CROLLO",
        type: "pericolo",
        description: "Crollo strutturale, acqua che invade tutto",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave", criticalFailure: "critica" },

        transitions: {
          success: ["R10_USCITA_ISOLATA"],
          partial: ["R10_USCITA_ISOLATA"],
          failure: ["R10_USCITA_ISOLATA"]
        }
      },

      R10_USCITA_SICURA: {
        id: "R10_USCITA_SICURA",
        type: "uscita",
        description: "Percorso sopraelevato che conduce fuori dal quartiere",

        transitions: {
          success: []
        }
      },

      R10_USCITA_ISOLATA: {
        id: "R10_USCITA_ISOLATA",
        type: "uscita",
        description: "Uscita lontana e isolata, ritorno faticoso verso Hope Town",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: []
        }
      }
    },

    connections: {
      R1_PUNTO_ACCESSO: ["R2_STRADA_ALLAGATA", "R3_CORTILE_INTERNO"],
      R2_STRADA_ALLAGATA: ["R4_EDIFICIO_RESIDENZIALE", "R3_CORTILE_INTERNO"],
      R3_CORTILE_INTERNO: ["R4_EDIFICIO_RESIDENZIALE", "R5_PIANO_TERRA"],
      R4_EDIFICIO_RESIDENZIALE: ["R6_APPARTAMENTO", "R5_PIANO_TERRA"],
      R5_PIANO_TERRA: ["R6_APPARTAMENTO", "R7_TETTI"],
      R6_APPARTAMENTO: ["R8_TORRE_RIPETITORE"],
      R7_TETTI: ["R8_TORRE_RIPETITORE", "R9_CROLLO"],
      R8_TORRE_RIPETITORE: ["R10_USCITA_SICURA", "R9_CROLLO"],
      R9_CROLLO: ["R10_USCITA_ISOLATA"]
    }
  }
}
