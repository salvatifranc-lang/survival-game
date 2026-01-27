export const LOC_ASCENSORE_SUP = {
  id: "LOC_ASCENSORE_SUP",
  name: "Complesso di ascensori di superficie",

  theme: "struttura verticale, esposizione diretta, meccanismi difettosi",
  missionType: "riattivazione collegamento e controllo accessi",

  entryRoom: "R1_BASE_ASCENSORE",
  exitRooms: ["R10_RITORNO_CONTROLLATO", "R10_RITORNO_ESPOSTO"],

  map: {
    rooms: {
      R1_BASE_ASCENSORE: {
        id: "R1_BASE_ASCENSORE",
        type: "ingresso",
        description: "Base dell’ascensore, cabina bloccata a livello inferiore",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R2_LOCALE_MOTORE"],
          partial: ["R2_LOCALE_MOTORE"],
          failure: ["R3_POZZO_ASCENSORE"]
        }
      },

      R2_LOCALE_MOTORE: {
        id: "R2_LOCALE_MOTORE",
        type: "recupero",
        description: "Locale motore con sistemi di sollevamento danneggiati",

        allowedTests: ["tecnica"],
        riskLevel: "medio",

        resources: {
          success: ["componenti_meccanici"],
          bonusSuccess: ["cavo_rinforzato"]
        },

        transitions: {
          success: ["R4_CABINA_ASCENSORE"],
          partial: ["R4_CABINA_ASCENSORE", "R3_POZZO_ASCENSORE"],
          failure: ["R3_POZZO_ASCENSORE"]
        }
      },

      R3_POZZO_ASCENSORE: {
        id: "R3_POZZO_ASCENSORE",
        type: "pericolo",
        description: "Pozzo verticale profondo, appigli instabili",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R4_CABINA_ASCENSORE"],
          partial: ["R5_PIANO_INTERMEDIO"],
          failure: ["R5_PIANO_INTERMEDIO"]
        }
      },

      R4_CABINA_ASCENSORE: {
        id: "R4_CABINA_ASCENSORE",
        type: "snodo",
        description: "Cabina dell’ascensore bloccata tra i livelli",

        allowedTests: ["tecnica", "resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R6_SALA_COMANDO"],
          partial: ["R6_SALA_COMANDO", "R5_PIANO_INTERMEDIO"],
          failure: ["R5_PIANO_INTERMEDIO"]
        }
      },

      R5_PIANO_INTERMEDIO: {
        id: "R5_PIANO_INTERMEDIO",
        type: "attraversamento",
        description: "Piano intermedio esposto, finestre aperte verso l’esterno",

        allowedTests: ["percezione"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R6_SALA_COMANDO"],
          partial: ["R7_PASSERELLA_ESTERNA"],
          failure: ["R7_PASSERELLA_ESTERNA"]
        }
      },

      R6_SALA_COMANDO: {
        id: "R6_SALA_COMANDO",
        type: "recupero",
        description: "Sala di comando degli ascensori, pannelli analogici",

        allowedTests: ["tecnica"],
        riskLevel: "basso",

        resources: {
          success: ["controlli_ascensore"],
          bonusSuccess: ["chiavi_accesso"]
        },

        transitions: {
          success: ["R8_STRUTTURA_SUPERIORE"],
          partial: ["R8_STRUTTURA_SUPERIORE"],
          failure: ["R7_PASSERELLA_ESTERNA"]
        }
      },

      R7_PASSERELLA_ESTERNA: {
        id: "R7_PASSERELLA_ESTERNA",
        type: "pericolo",
        description: "Passerella esterna sospesa, vento forte e visibilità totale",

        allowedTests: ["equilibrio"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R8_STRUTTURA_SUPERIORE"],
          partial: ["R9_ESPOSIZIONE"],
          failure: ["R9_ESPOSIZIONE"]
        }
      },

      R8_STRUTTURA_SUPERIORE: {
        id: "R8_STRUTTURA_SUPERIORE",
        type: "conflitto",
        description: "Struttura superiore dell’ascensore, meccanismi scoperti",

        enemies: ["sistemi_blocco"],
        allowedTests: ["tecnica", "resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        resources: {
          success: ["collegamento_attivo"]
        },

        transitions: {
          success: ["R10_RITORNO_CONTROLLATO"],
          partial: ["R9_ESPOSIZIONE"],
          failure: ["R9_ESPOSIZIONE"]
        }
      },

      R9_ESPOSIZIONE: {
        id: "R9_ESPOSIZIONE",
        type: "pericolo",
        description: "Esposizione diretta alla superficie, nessuna copertura",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave", criticalFailure: "critica" },

        transitions: {
          success: ["R10_RITORNO_ESPOSTO"],
          partial: ["R10_RITORNO_ESPOSTO"],
          failure: ["R10_RITORNO_ESPOSTO"]
        }
      },

      R10_RITORNO_CONTROLLATO: {
        id: "R10_RITORNO_CONTROLLATO",
        type: "uscita",
        description: "Ritorno a Hope Town con collegamento verticale riattivato",

        transitions: {
          success: []
        }
      },

      R10_RITORNO_ESPOSTO: {
        id: "R10_RITORNO_ESPOSTO",
        type: "uscita",
        description: "Rientro difficoltoso sotto osservazione dalla superficie",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: []
        }
      }
    },

    connections: {
      R1_BASE_ASCENSORE: ["R2_LOCALE_MOTORE", "R3_POZZO_ASCENSORE"],
      R2_LOCALE_MOTORE: ["R4_CABINA_ASCENSORE", "R3_POZZO_ASCENSORE"],
      R3_POZZO_ASCENSORE: ["R4_CABINA_ASCENSORE", "R5_PIANO_INTERMEDIO"],
      R4_CABINA_ASCENSORE: ["R6_SALA_COMANDO", "R5_PIANO_INTERMEDIO"],
      R5_PIANO_INTERMEDIO: ["R6_SALA_COMANDO", "R7_PASSERELLA_ESTERNA"],
      R6_SALA_COMANDO: ["R8_STRUTTURA_SUPERIORE"],
      R7_PASSERELLA_ESTERNA: ["R8_STRUTTURA_SUPERIORE", "R9_ESPOSIZIONE"],
      R8_STRUTTURA_SUPERIORE: ["R10_RITORNO_CONTROLLATO", "R9_ESPOSIZIONE"],
      R9_ESPOSIZIONE: ["R10_RITORNO_ESPOSTO"]
    }
  }
}
