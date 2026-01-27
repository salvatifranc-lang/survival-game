export const LOC_OSPEDALE_SUP = {
  id: "LOC_OSPEDALE_SUP",
  name: "Ospedale di superficie",

  theme: "struttura sanitaria in rovina, vegetazione invasiva, tecnologia medica attiva",
  missionType: "recupero materiali medici e archivi clinici",

  entryRoom: "R1_INGRESSO_PRINCIPALE",
  exitRooms: ["R10_USCITA_SANIFICATA", "R10_USCITA_EMERGENZA"],

  map: {
    rooms: {
      R1_INGRESSO_PRINCIPALE: {
        id: "R1_INGRESSO_PRINCIPALE",
        type: "ingresso",
        description: "Ingresso dell’ospedale invaso da piante e detriti",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R2_CORRIDOIO_TRIAGE"],
          partial: ["R2_CORRIDOIO_TRIAGE"],
          failure: ["R3_ACCESSO_LATERALE"]
        }
      },

      R2_CORRIDOIO_TRIAGE: {
        id: "R2_CORRIDOIO_TRIAGE",
        type: "snodo",
        description: "Corridoio del triage con barelle rovesciate",

        allowedTests: ["percezione"],
        riskLevel: "medio",

        transitions: {
          success: ["R4_REPARTO_DEGENZA"],
          partial: ["R4_REPARTO_DEGENZA", "R3_ACCESSO_LATERALE"],
          failure: ["R3_ACCESSO_LATERALE"]
        }
      },

      R3_ACCESSO_LATERALE: {
        id: "R3_ACCESSO_LATERALE",
        type: "pericolo",
        description: "Ingresso secondario con porte automatiche difettose",

        allowedTests: ["resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -2 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R4_REPARTO_DEGENZA"],
          partial: ["R5_LABORATORIO"],
          failure: ["R5_LABORATORIO"]
        }
      },

      R4_REPARTO_DEGENZA: {
        id: "R4_REPARTO_DEGENZA",
        type: "recupero",
        description: "Reparto di degenza abbandonato, armadietti medici sparsi",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        resources: {
          success: ["scorte_mediche"],
          bonusSuccess: ["farmaci_rari"]
        },

        transitions: {
          success: ["R6_SALA_OPERATORIA"],
          partial: ["R6_SALA_OPERATORIA"],
          failure: ["R5_LABORATORIO"]
        }
      },

      R5_LABORATORIO: {
        id: "R5_LABORATORIO",
        type: "pericolo",
        description: "Laboratorio con apparecchiature ancora attive",

        enemies: ["sistemi_medici"],
        allowedTests: ["tecnica"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R6_SALA_OPERATORIA"],
          partial: ["R7_SCALE_EMERGENZA"],
          failure: ["R7_SCALE_EMERGENZA"]
        }
      },

      R6_SALA_OPERATORIA: {
        id: "R6_SALA_OPERATORIA",
        type: "conflitto",
        description: "Sala operatoria con macchinari automatici in funzione",

        enemies: ["robot_chirurgico"],
        allowedTests: ["furtività", "tecnica"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        resources: {
          success: ["strumenti_chirurgici"]
        },

        transitions: {
          success: ["R8_ARCHIVIO_CLINICO"],
          partial: ["R7_SCALE_EMERGENZA"],
          failure: ["R7_SCALE_EMERGENZA"]
        }
      },

      R7_SCALE_EMERGENZA: {
        id: "R7_SCALE_EMERGENZA",
        type: "attraversamento",
        description: "Scale di emergenza parzialmente crollate",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R8_ARCHIVIO_CLINICO"],
          partial: ["R9_CROLLO_INTERNO"],
          failure: ["R9_CROLLO_INTERNO"]
        }
      },

      R8_ARCHIVIO_CLINICO: {
        id: "R8_ARCHIVIO_CLINICO",
        type: "recupero",
        description: "Archivio clinico cartaceo e digitale danneggiato",

        allowedTests: ["percezione", "tecnica"],
        riskLevel: "medio",

        resources: {
          success: ["dati_clinici"],
          bonusSuccess: ["cartelle_intatte"]
        },

        transitions: {
          success: ["R10_USCITA_SANIFICATA"],
          partial: ["R9_CROLLO_INTERNO"],
          failure: ["R9_CROLLO_INTERNO"]
        }
      },

      R9_CROLLO_INTERNO: {
        id: "R9_CROLLO_INTERNO",
        type: "pericolo",
        description: "Crollo improvviso di un’ala dell’ospedale",

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

      R10_USCITA_SANIFICATA: {
        id: "R10_USCITA_SANIFICATA",
        type: "uscita",
        description: "Uscita relativamente sicura con materiali recuperati",

        transitions: {
          success: []
        }
      },

      R10_USCITA_EMERGENZA: {
        id: "R10_USCITA_EMERGENZA",
        type: "uscita",
        description: "Fuga caotica attraverso un’uscita di servizio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: []
        }
      }
    },

    connections: {
      R1_INGRESSO_PRINCIPALE: ["R2_CORRIDOIO_TRIAGE", "R3_ACCESSO_LATERALE"],
      R2_CORRIDOIO_TRIAGE: ["R4_REPARTO_DEGENZA", "R3_ACCESSO_LATERALE"],
      R3_ACCESSO_LATERALE: ["R4_REPARTO_DEGENZA", "R5_LABORATORIO"],
      R4_REPARTO_DEGENZA: ["R6_SALA_OPERATORIA", "R5_LABORATORIO"],
      R5_LABORATORIO: ["R6_SALA_OPERATORIA", "R7_SCALE_EMERGENZA"],
      R6_SALA_OPERATORIA: ["R8_ARCHIVIO_CLINICO", "R7_SCALE_EMERGENZA"],
      R7_SCALE_EMERGENZA: ["R8_ARCHIVIO_CLINICO", "R9_CROLLO_INTERNO"],
      R8_ARCHIVIO_CLINICO: ["R10_USCITA_SANIFICATA", "R9_CROLLO_INTERNO"],
      R9_CROLLO_INTERNO: ["R10_USCITA_EMERGENZA"]
    }
  }
}
