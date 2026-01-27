export const LOC_CENTRO_COMM = {
  id: "LOC_CENTRO_COMM",
  name: "Centro di comunicazione militare",

  theme: "bunker militare isolato, sistemi difensivi automatici, segnali tracciabili",
  missionType: "recupero codici e interruzione segnali",

  entryRoom: "R1_ACCESSO_BUNKER",
  exitRooms: ["R10_USCITA_SILENZIOSA", "R10_USCITA_TRACCIATA"],

  map: {
    rooms: {
      R1_ACCESSO_BUNKER: {
        id: "R1_ACCESSO_BUNKER",
        type: "ingresso",
        description: "Ingresso blindato del bunker, porte parzialmente aperte",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R2_CORRIDOIO_BLINDATO"],
          partial: ["R2_CORRIDOIO_BLINDATO"],
          failure: ["R3_ACCESSO_SERVIZIO"]
        }
      },

      R2_CORRIDOIO_BLINDATO: {
        id: "R2_CORRIDOIO_BLINDATO",
        type: "attraversamento",
        description: "Corridoio rinforzato con sensori di movimento",

        enemies: ["sensori_militari"],
        allowedTests: ["furtività"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R4_SALA_RADAR"],
          partial: ["R4_SALA_RADAR", "R3_ACCESSO_SERVIZIO"],
          failure: ["R3_ACCESSO_SERVIZIO"]
        }
      },

      R3_ACCESSO_SERVIZIO: {
        id: "R3_ACCESSO_SERVIZIO",
        type: "pericolo",
        description: "Condotto di servizio con cavi scoperti e scariche",

        allowedTests: ["resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -2 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R4_SALA_RADAR"],
          partial: ["R5_CENTRALE_ENERGIA"],
          failure: ["R5_CENTRALE_ENERGIA"]
        }
      },

      R4_SALA_RADAR: {
        id: "R4_SALA_RADAR",
        type: "snodo",
        description: "Sala radar con schermi ancora intermittenti",

        allowedTests: ["percezione", "tecnica"],
        riskLevel: "medio",

        resources: {
          success: ["mappe_militari"],
          bonusSuccess: ["frequenze_radio"]
        },

        transitions: {
          success: ["R6_TERMINALI_CRIPTATI"],
          partial: ["R6_TERMINALI_CRIPTATI", "R5_CENTRALE_ENERGIA"],
          failure: ["R5_CENTRALE_ENERGIA"]
        }
      },

      R5_CENTRALE_ENERGIA: {
        id: "R5_CENTRALE_ENERGIA",
        type: "pericolo",
        description: "Centrale energetica con sovraccarichi",

        allowedTests: ["tecnica"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R6_TERMINALI_CRIPTATI"],
          partial: ["R7_BUNKER_LATERALE"],
          failure: ["R7_BUNKER_LATERALE"]
        }
      },

      R6_TERMINALI_CRIPTATI: {
        id: "R6_TERMINALI_CRIPTATI",
        type: "recupero",
        description: "Terminali militari protetti da cifratura",

        allowedTests: ["tecnica"],
        riskLevel: "basso",

        resources: {
          success: ["codici_criptati"],
          bonusSuccess: ["chiavi_militari"]
        },

        transitions: {
          success: ["R8_SALA_CONTROLLO"],
          partial: ["R8_SALA_CONTROLLO"],
          failure: ["R7_BUNKER_LATERALE"]
        }
      },

      R7_BUNKER_LATERALE: {
        id: "R7_BUNKER_LATERALE",
        type: "attraversamento",
        description: "Sezione laterale del bunker, poco mappata",

        allowedTests: ["percezione"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R8_SALA_CONTROLLO"],
          partial: ["R9_ALLARME"],
          failure: ["R9_ALLARME"]
        }
      },

      R8_SALA_CONTROLLO: {
        id: "R8_SALA_CONTROLLO",
        type: "conflitto",
        description: "Sala di controllo centrale con sistemi difensivi",

        enemies: ["difesa_automatica"],
        allowedTests: ["tecnica", "furtività"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        resources: {
          success: ["segnali_interrotti"]
        },

        transitions: {
          success: ["R10_USCITA_SILENZIOSA"],
          partial: ["R9_ALLARME"],
          failure: ["R9_ALLARME"]
        }
      },

      R9_ALLARME: {
        id: "R9_ALLARME",
        type: "pericolo",
        description: "Allarme attivo, segnali tracciabili verso l’esterno",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave", criticalFailure: "critica" },

        transitions: {
          success: ["R10_USCITA_TRACCIATA"],
          partial: ["R10_USCITA_TRACCIATA"],
          failure: ["R10_USCITA_TRACCIATA"]
        }
      },

      R10_USCITA_SILENZIOSA: {
        id: "R10_USCITA_SILENZIOSA",
        type: "uscita",
        description: "Uscita nascosta senza lasciare tracce",

        transitions: {
          success: []
        }
      },

      R10_USCITA_TRACCIATA: {
        id: "R10_USCITA_TRACCIATA",
        type: "uscita",
        description: "Rientro rapido con segnali potenzialmente intercettati",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: []
        }
      }
    },

    connections: {
      R1_ACCESSO_BUNKER: ["R2_CORRIDOIO_BLINDATO", "R3_ACCESSO_SERVIZIO"],
      R2_CORRIDOIO_BLINDATO: ["R4_SALA_RADAR", "R3_ACCESSO_SERVIZIO"],
      R3_ACCESSO_SERVIZIO: ["R4_SALA_RADAR", "R5_CENTRALE_ENERGIA"],
      R4_SALA_RADAR: ["R6_TERMINALI_CRIPTATI", "R5_CENTRALE_ENERGIA"],
      R5_CENTRALE_ENERGIA: ["R6_TERMINALI_CRIPTATI", "R7_BUNKER_LATERALE"],
      R6_TERMINALI_CRIPTATI: ["R8_SALA_CONTROLLO"],
      R7_BUNKER_LATERALE: ["R8_SALA_CONTROLLO", "R9_ALLARME"],
      R8_SALA_CONTROLLO: ["R10_USCITA_SILENZIOSA", "R9_ALLARME"],
      R9_ALLARME: ["R10_USCITA_TRACCIATA"]
    }
  }
}
