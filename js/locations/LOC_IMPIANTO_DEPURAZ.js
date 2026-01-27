export const LOC_IMPIANTO_DEPURAZ = {
  id: "LOC_IMPIANTO_DEPURAZ",
  name: "Impianto di depurazione abbandonato",

  theme: "complesso industriale in rovina, contaminazione chimica, macchinari instabili",
  missionType: "verifica risorse e riattivazione parziale",

  entryRoom: "R1_ACCESSO_EST",
  exitRooms: ["R10_USCITA_CONTROLLATA", "R10_USCITA_CONTAMINATA"],

  map: {
    rooms: {
      R1_ACCESSO_EST: {
        id: "R1_ACCESSO_EST",
        type: "ingresso",
        description: "Cancello divelto dell’impianto, odore acre nell’aria",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R2_VASCA_DECANTAZIONE"],
          partial: ["R2_VASCA_DECANTAZIONE"],
          failure: ["R3_CANALI_SCARICO"]
        }
      },

      R2_VASCA_DECANTAZIONE: {
        id: "R2_VASCA_DECANTAZIONE",
        type: "attraversamento",
        description: "Vasca di decantazione semi-asciutta con fanghi tossici",

        allowedTests: ["equilibrio", "resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R4_SALA_FILTRI"],
          partial: ["R4_SALA_FILTRI", "R3_CANALI_SCARICO"],
          failure: ["R3_CANALI_SCARICO"]
        }
      },

      R3_CANALI_SCARICO: {
        id: "R3_CANALI_SCARICO",
        type: "pericolo",
        description: "Canali di scarico aperti, liquidi corrosivi ancora attivi",

        allowedTests: ["resistenza"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R4_SALA_FILTRI"],
          partial: ["R5_TUNNEL_MANUTENZIONE"],
          failure: ["R5_TUNNEL_MANUTENZIONE"]
        }
      },

      R4_SALA_FILTRI: {
        id: "R4_SALA_FILTRI",
        type: "snodo",
        description: "Sala filtri con sistemi meccanici ancora collegati",

        allowedTests: ["tecnica", "percezione"],
        riskLevel: "medio",

        resources: {
          success: ["filtri_ricambio"],
          bonusSuccess: ["valvola_intatta"]
        },

        transitions: {
          success: ["R6_CENTRALE_CONTROLLO"],
          partial: ["R6_CENTRALE_CONTROLLO", "R5_TUNNEL_MANUTENZIONE"],
          failure: ["R5_TUNNEL_MANUTENZIONE"]
        }
      },

      R5_TUNNEL_MANUTENZIONE: {
        id: "R5_TUNNEL_MANUTENZIONE",
        type: "attraversamento",
        description: "Tunnel di manutenzione buio e scivoloso",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R6_CENTRALE_CONTROLLO"],
          partial: ["R7_REATTORI"],
          failure: ["R7_REATTORI"]
        }
      },

      R6_CENTRALE_CONTROLLO: {
        id: "R6_CENTRALE_CONTROLLO",
        type: "recupero",
        description: "Centrale di controllo con pannelli analogici danneggiati",

        allowedTests: ["tecnica"],
        riskLevel: "basso",

        resources: {
          success: ["dati_potabilita"],
          bonusSuccess: ["schema_impianto"]
        },

        transitions: {
          success: ["R8_RETE_IDRICA"],
          partial: ["R8_RETE_IDRICA"],
          failure: ["R7_REATTORI"]
        }
      },

      R7_REATTORI: {
        id: "R7_REATTORI",
        type: "pericolo",
        description: "Zona reattori chimici instabili",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R8_RETE_IDRICA"],
          partial: ["R9_FUORIUSCITA"],
          failure: ["R9_FUORIUSCITA"]
        }
      },

      R8_RETE_IDRICA: {
        id: "R8_RETE_IDRICA",
        type: "conflitto",
        description: "Nodo di distribuzione idrica, pressione irregolare",

        allowedTests: ["tecnica", "resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        resources: {
          success: ["acqua_trattabile"]
        },

        transitions: {
          success: ["R10_USCITA_CONTROLLATA"],
          partial: ["R9_FUORIUSCITA"],
          failure: ["R9_FUORIUSCITA"]
        }
      },

      R9_FUORIUSCITA: {
        id: "R9_FUORIUSCITA",
        type: "pericolo",
        description: "Fuoriuscita chimica improvvisa",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave", criticalFailure: "critica" },

        transitions: {
          success: ["R10_USCITA_CONTAMINATA"],
          partial: ["R10_USCITA_CONTAMINATA"],
          failure: ["R10_USCITA_CONTAMINATA"]
        }
      },

      R10_USCITA_CONTROLLATA: {
        id: "R10_USCITA_CONTROLLATA",
        type: "uscita",
        description: "Uscita sicura dopo messa in sicurezza parziale dell’impianto",

        transitions: {
          success: []
        }
      },

      R10_USCITA_CONTAMINATA: {
        id: "R10_USCITA_CONTAMINATA",
        type: "uscita",
        description: "Rientro forzato con rischio di contaminazione residua",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

                transitions: {
          success: []
        }
      }
    }
  }
};

