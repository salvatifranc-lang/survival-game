export const LOC_MAGAZZINI_LOG = {
  id: "LOC_MAGAZZINI_LOG",
  name: "Magazzini logistici automatizzati",

  theme: "depositi periferici, automazione obsoleta, spazi aperti esposti",
  missionType: "recupero beni industriali e disattivazione sistemi",

  entryRoom: "R1_AREA_SCARICO",
  exitRooms: ["R10_USCITA_ORDINATA", "R10_USCITA_INSEGUIMENTO"],

  map: {
    rooms: {
      R1_AREA_SCARICO: {
        id: "R1_AREA_SCARICO",
        type: "ingresso",
        description: "Ampia area di scarico, nastri trasportatori bloccati",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        staminaEffects: { onEntry: -1 },

        transitions: {
          success: ["R2_CORRIDOI_SCAFFALI"],
          partial: ["R2_CORRIDOI_SCAFFALI"],
          failure: ["R3_PIAZZALE_APERTO"]
        }
      },

      R2_CORRIDOI_SCAFFALI: {
        id: "R2_CORRIDOI_SCAFFALI",
        type: "attraversamento",
        description: "Corridoi tra scaffalature alte e instabili",

        allowedTests: ["equilibrio", "percezione"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        resources: {
          success: ["beni_industriali"]
        },

        transitions: {
          success: ["R4_NODO_SMISTAMENTO"],
          partial: ["R4_NODO_SMISTAMENTO", "R3_PIAZZALE_APERTO"],
          failure: ["R3_PIAZZALE_APERTO"]
        }
      },

      R3_PIAZZALE_APERTO: {
        id: "R3_PIAZZALE_APERTO",
        type: "pericolo",
        description: "Piazzale esterno scoperto, droni in pattugliamento erratico",

        enemies: ["drone_logistico"],
        allowedTests: ["furtività"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1, onFailure: -2 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R4_NODO_SMISTAMENTO"],
          partial: ["R5_MAGAZZINO_SECONDARIO"],
          failure: ["R5_MAGAZZINO_SECONDARIO"]
        }
      },

      R4_NODO_SMISTAMENTO: {
        id: "R4_NODO_SMISTAMENTO",
        type: "snodo",
        description: "Nodo centrale di smistamento automatizzato",

        enemies: ["sistema_smista"],
        allowedTests: ["tecnica", "furtività"],
        riskLevel: "medio",

        resources: {
          success: ["componenti_meccanici"],
          bonusSuccess: ["chiave_logistica"]
        },

        transitions: {
          success: ["R6_MAGAZZINO_ALTO"],
          partial: ["R6_MAGAZZINO_ALTO", "R5_MAGAZZINO_SECONDARIO"],
          failure: ["R5_MAGAZZINO_SECONDARIO"]
        }
      },

      R5_MAGAZZINO_SECONDARIO: {
        id: "R5_MAGAZZINO_SECONDARIO",
        type: "recupero",
        description: "Deposito secondario meno automatizzato",

        allowedTests: ["percezione"],
        riskLevel: "basso",

        resources: {
          success: ["scorte_varie"],
          bonusSuccess: ["attrezzi"]
        },

        transitions: {
          success: ["R6_MAGAZZINO_ALTO"],
          partial: ["R6_MAGAZZINO_ALTO"],
          failure: ["R7_PASSERELLE"]
        }
      },

      R6_MAGAZZINO_ALTO: {
        id: "R6_MAGAZZINO_ALTO",
        type: "attraversamento",
        description: "Zona sopraelevata tra scaffali automatizzati",

        allowedTests: ["equilibrio"],
        riskLevel: "medio",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: ["R8_CENTRO_CONTROLLO"],
          partial: ["R7_PASSERELLE"],
          failure: ["R7_PASSERELLE"]
        }
      },

      R7_PASSERELLE: {
        id: "R7_PASSERELLE",
        type: "pericolo",
        description: "Passerelle metalliche instabili sopra il vuoto",

        allowedTests: ["equilibrio"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave" },

        transitions: {
          success: ["R8_CENTRO_CONTROLLO"],
          partial: ["R9_COLLISIONE"],
          failure: ["R9_COLLISIONE"]
        }
      },

      R8_CENTRO_CONTROLLO: {
        id: "R8_CENTRO_CONTROLLO",
        type: "conflitto",
        description: "Centro di controllo dei magazzini automatici",

        enemies: ["IA_logistica"],
        allowedTests: ["tecnica", "furtività"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "grave" },

        resources: {
          success: ["sistemi_disattivati"]
        },

        transitions: {
          success: ["R10_USCITA_ORDINATA"],
          partial: ["R9_COLLISIONE"],
          failure: ["R9_COLLISIONE"]
        }
      },

      R9_COLLISIONE: {
        id: "R9_COLLISIONE",
        type: "pericolo",
        description: "Collisione di carrelli automatici fuori controllo",

        allowedTests: ["resistenza"],
        riskLevel: "alto",

        staminaEffects: { onEntry: -2 },
        injuryRisk: { failure: "grave", criticalFailure: "critica" },

        transitions: {
          success: ["R10_USCITA_INSEGUIMENTO"],
          partial: ["R10_USCITA_INSEGUIMENTO"],
          failure: ["R10_USCITA_INSEGUIMENTO"]
        }
      },

      R10_USCITA_ORDINATA: {
        id: "R10_USCITA_ORDINATA",
        type: "uscita",
        description: "Uscita controllata dopo la disattivazione dei sistemi",

        transitions: {
          success: []
        }
      },

      R10_USCITA_INSEGUIMENTO: {
        id: "R10_USCITA_INSEGUIMENTO",
        type: "uscita",
        description: "Fuga sotto inseguimento di droni residui",

        staminaEffects: { onEntry: -1 },
        injuryRisk: { failure: "leggera" },

        transitions: {
          success: []
        }
      }
    },

    connections: {
      R1_AREA_SCARICO: ["R2_CORRIDOI_SCAFFALI", "R3_PIAZZALE_APERTO"],
      R2_CORRIDOI_SCAFFALI: ["R4_NODO_SMISTAMENTO", "R3_PIAZZALE_APERTO"],
      R3_PIAZZALE_APERTO: ["R4_NODO_SMISTAMENTO", "R5_MAGAZZINO_SECONDARIO"],
      R4_NODO_SMISTAMENTO: ["R6_MAGAZZINO_ALTO", "R5_MAGAZZINO_SECONDARIO"],
      R5_MAGAZZINO_SECONDARIO: ["R6_MAGAZZINO_ALTO", "R7_PASSERELLE"],
      R6_MAGAZZINO_ALTO: ["R8_CENTRO_CONTROLLO", "R7_PASSERELLE"],
      R7_PASSERELLE: ["R8_CENTRO_CONTROLLO", "R9_COLLISIONE"],
      R8_CENTRO_CONTROLLO: ["R10_USCITA_ORDINATA", "R9_COLLISIONE"],
      R9_COLLISIONE: ["R10_USCITA_INSEGUIMENTO"]
    }
  }
}
