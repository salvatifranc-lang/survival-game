export const LOC_DATA_CENTER = {
  id: "LOC_DATA_CENTER",
  name: "Data Center dismesso",

  theme: "struttura sotterranea, tecnologia instabile, sorveglianza automatica",
  missionType: "estrazione dati e sabotaggio",

  entryRoom: "R1_ACCESSO_PERIMETRALE",
  exitRooms: ["R10_USCITA_CONTROLLO", "R10_USCITA_FORZATA"],

  map: {
    rooms: {
      R1_ACCESSO_PERIMETRALE: {
        id: "R1_ACCESSO_PERIMETRALE",
        type: "ingresso",
        description: "Ingresso secondario schermato, pannelli divelti e cablaggi scoperti",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R2_CORRIDOIO_TECNICO"],
          partial: ["R2_CORRIDOIO_TECNICO"],
          failure: ["R3_CABINA_ELETTRICA"]
        }
      },

      R2_CORRIDOIO_TECNICO: {
        id: "R2_CORRIDOIO_TECNICO",
        type: "snodo",
        description: "Corridoio stretto con luci intermittenti e sensori attivi",

        enemies: ["sensori_sicurezza"],
        allowedTests: ["furtività", "tecnica"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R4_SALA_SERVER"],
          partial: ["R4_SALA_SERVER", "R3_CABINA_ELETTRICA"],
          failure: ["R3_CABINA_ELETTRICA"]
        }
      },

      R3_CABINA_ELETTRICA: {
        id: "R3_CABINA_ELETTRICA",
        type: "pericolo",
        description: "Cabina di distribuzione con scariche elettriche irregolari",

        allowedTests: ["resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -2 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R4_SALA_SERVER"],
          partial: ["R5_PASSAGGIO_SERVIZIO"],
          failure: ["R5_PASSAGGIO_SERVIZIO"]
        }
      },

      R4_SALA_SERVER: {
        id: "R4_SALA_SERVER",
        type: "recupero",
        description: "Sala server principale, rack parzialmente funzionanti",

        enemies: ["drone_sorveglianza"],
        allowedTests: ["tecnica", "percezione"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },

        resources: {
          success: ["dati_archiviati"],
          bonusSuccess: ["modulo_memoria"]
        },

        transitions: {
          success: ["R6_NODO_RETE"],
          partial: ["R6_NODO_RETE", "R5_PASSAGGIO_SERVIZIO"],
          failure: ["R5_PASSAGGIO_SERVIZIO"]
        }
      },

      R5_PASSAGGIO_SERVIZIO: {
        id: "R5_PASSAGGIO_SERVIZIO",
        type: "attraversamento",
        description: "Condotti di manutenzione angusti e soffocanti",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R6_NODO_RETE"],
          partial: ["R7_CAMERA_RAFFREDDAMENTO"],
          failure: ["R7_CAMERA_RAFFREDDAMENTO"]
        }
      },

      R6_NODO_RETE: {
        id: "R6_NODO_RETE",
        type: "snodo",
        description: "Centro di smistamento dati, connessioni instabili",

        allowedTests: ["tecnica"],
        riskLevel: "medio",

        resources: {
          success: ["chiave_accesso"],
          bonusSuccess: ["mappa_rete"]
        },

        transitions: {
          success: ["R8_CONTROLLO_SICUREZZA"],
          partial: ["R8_CONTROLLO_SICUREZZA", "R7_CAMERA_RAFFREDDAMENTO"],
          failure: ["R7_CAMERA_RAFFREDDAMENTO"]
        }
      },

      R7_CAMERA_RAFFREDDAMENTO: {
        id: "R7_CAMERA_RAFFREDDAMENTO",
        type: "pericolo",
        description: "Area di raffreddamento criogenico fuori controllo",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R8_CONTROLLO_SICUREZZA"],
          partial: ["R9_BLACKOUT"],
          failure: ["R9_BLACKOUT"]
        }
      },

      R8_CONTROLLO_SICUREZZA: {
        id: "R8_CONTROLLO_SICUREZZA",
        type: "conflitto",
        description: "Sala di sicurezza con IA difensiva ancora attiva",

        enemies: ["IA_difensiva"],
        allowedTests: ["tecnica", "furtività"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        resources: {
          success: ["codici_accesso"]
        },

        transitions: {
          success: ["R10_USCITA_CONTROLLO"],
          partial: ["R9_BLACKOUT"],
          failure: ["R9_BLACKOUT"]
        }
      },

      R9_BLACKOUT: {
        id: "R9_BLACKOUT",
        type: "pericolo",
        description: "Blackout totale, sistemi che collassano a cascata",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave", criticalFailure: "critica" },

        transitions: {
          success: ["R10_USCITA_FORZATA"],
          partial: ["R10_USCITA_FORZATA"],
          failure: ["R10_USCITA_FORZATA"]
        }
      },

      R10_USCITA_CONTROLLO: {
        id: "R10_USCITA_CONTROLLO",
        type: "uscita",
        description: "Uscita sicura dopo il controllo dei sistemi",

        transitions: {
          success: []
        }
      },

      R10_USCITA_FORZATA: {
        id: "R10_USCITA_FORZATA",
        type: "uscita",
        description: "Fuga caotica durante il collasso energetico",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: []
        }
      }
    },

    connections: {
      R1_ACCESSO_PERIMETRALE: ["R2_CORRIDOIO_TECNICO", "R3_CABINA_ELETTRICA"],
      R2_CORRIDOIO_TECNICO: ["R4_SALA_SERVER", "R3_CABINA_ELETTRICA"],
      R3_CABINA_ELETTRICA: ["R4_SALA_SERVER", "R5_PASSAGGIO_SERVIZIO"],
      R4_SALA_SERVER: ["R6_NODO_RETE", "R5_PASSAGGIO_SERVIZIO"],
      R5_PASSAGGIO_SERVIZIO: ["R6_NODO_RETE", "R7_CAMERA_RAFFREDDAMENTO"],
      R6_NODO_RETE: ["R8_CONTROLLO_SICUREZZA", "R7_CAMERA_RAFFREDDAMENTO"],
      R7_CAMERA_RAFFREDDAMENTO: ["R8_CONTROLLO_SICUREZZA", "R9_BLACKOUT"],
      R8_CONTROLLO_SICUREZZA: ["R10_USCITA_CONTROLLO", "R9_BLACKOUT"],
      R9_BLACKOUT: ["R10_USCITA_FORZATA"]
    }
  }
}
