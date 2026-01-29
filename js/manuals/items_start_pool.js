 export const START_ITEMS_POOL = {
  weapons: [
    {
      id: "PISTOLA_SERV",
      category: "weapon",
      rarity: "common",
      modifiers: {
        scontro: +2,
        furtività: -1
      }
    },
    {
      id: "TUBO_METAL",
      category: "weapon",
      rarity: "common",
      modifiers: {
        scontro: +1,
        resistenza: +1,
        destrezza: -1
      }
    },
    {
      id: "LAMA_INDUSTR",
      category: "weapon",
      rarity: "non_common",
      modifiers: {
        scontro: +2,
        destrezza: -1
      }
    },
    {
      id: "FUCILE_POMPA",
      category: "weapon",
      rarity: "non_common",
      modifiers: {
        scontro: +3,
        furtività: -2,
        destrezza: -1
      }
    },

    // --- ARMI AGGIUNTIVE ---

    {
      id: "MACHETE_RECUP",
      category: "weapon",
      rarity: "common",
      modifiers: {
        scontro: +2,
        sopravvivenza: +1
      }
    },
    {
      id: "MAZZA_CHIODATA",
      category: "weapon",
      rarity: "common",
      modifiers: {
        scontro: +2,
        resistenza: +1,
        destrezza: -2
      }
    },
    {
      id: "FUCILE_CACCIA",
      category: "weapon",
      rarity: "non_common",
      modifiers: {
        scontro: +3,
        destrezza: -1,
        furtività: -1
      }
    },
    {
      id: "PISTOLA_SEGNALAZ",
      category: "weapon",
      rarity: "non_common",
      modifiers: {
        scontro: +1,
        sopravvivenza: +2,
        furtività: -1
      }
    }
    // volutamente NON tutte le armi rare
  ],

  tools: [
    {
      id: "TUNNEL_LAMP_FRAG",
      category: "tool",
      rarity: "common",
      modifiers: {
        percezione: +3,
        furtività: -1
      }
    },
    {
      id: "MAPPA_CARTACEA",
      category: "tool",
      rarity: "common",
      modifiers: {
        sopravvivenza: +2,
        percezione: +1
      }
    },
    {
      id: "KIT_RIPARAZ_IMP",
      category: "tool",
      rarity: "common",
      modifiers: {
        tecnico: +2,
        destrezza: -1
      }
    },
    {
      id: "CONTEN_ACQUA",
      category: "tool",
      rarity: "common",
      modifiers: {
        sopravvivenza: +3,
        destrezza: -1
      }
    },
    {
      id: "RADIO_CORTA_ONDA",
      category: "tool",
      rarity: "non_common",
      modifiers: {
        percezione: +2,
        tecnico: +1,
        furtività: -1
      }
    },

    // --- TOOLS AGGIUNTIVI ---

    {
      id: "FILTRO_ANTI_RAD",
      category: "tool",
      rarity: "non_common",
      modifiers: {
        sopravvivenza: +3,
        resistenza: -1
      }
    },
    {
      id: "BINOCOLI_ROVINATI",
      category: "tool",
      rarity: "common",
      modifiers: {
        percezione: +2,
        destrezza: -1
      }
    },
    {
      id: "CORDA_USURATA",
      category: "tool",
      rarity: "common",
      modifiers: {
        destrezza: +2,
        resistenza: -1
      }
    },
    {
      id: "TENDA_IMPROVV",
      category: "tool",
      rarity: "common",
      modifiers: {
        sopravvivenza: +2,
        resistenza: +1,
        destrezza: -1
      }
    },
    {
      id: "MULTIUTENSILE",
      category: "tool",
      rarity: "non_common",
      modifiers: {
        tecnico: +2,
        sopravvivenza: +1
      }
    },
    {
      id: "TORCIA_CHIMICA",
      category: "tool",
      rarity: "common",
      modifiers: {
        percezione: +2,
        furtività: -1
      }
    },
    {
      id: "KIT_MEDICO_BASE",
      category: "tool",
      rarity: "non_common",
      modifiers: {
        resistenza: +3,
        tecnico: -1
      }
    },
    {
      id: "BUSSOLA_MAGN",
      category: "tool",
      rarity: "common",
      modifiers: {
        sopravvivenza: +2,
        percezione: +1
      }
    },
    {
      id: "ZAINO_RINFORZ",
      category: "tool",
      rarity: "non_common",
      modifiers: {
        sopravvivenza: +2,
        destrezza: -2
      }
    },
    {
      id: "TELONE_ISOLANTE",
      category: "tool",
      rarity: "common",
      modifiers: {
        resistenza: +


  consumables: [
    {
      id: "RAZIONE_SECCA",
      category: "consumable",
      rarity: "common",
      effect: {
        type: "recover",
        target: "stamina",
        value: 3
      }
    },
    {
      id: "BATTERIA_USATA",
      category: "consumable",
      rarity: "common",
      effect: {
        type: "bonus",
        value: +5,
        description: "Bonus secco al prossimo tiro che utilizza un oggetto tecnologico"
      }
    },
    {
      id: "MED_PATCH",
      category: "consumable",
      rarity: "non_common",
      effect: {
        type: "recover",
        target: "health",
        value: 5
      }
    },
    {
      id: "STIM_IMP",
      category: "consumable",
      rarity: "non_common",
      effect: {
        type: "recover",
        target: "stamina",
        value: 5
      }
    },

    // --- CONSUMABILI AGGIUNTIVI ---

    {
      id: "BARRETTA_PROTEICA",
      category: "consumable",
      rarity: "common",
      effect: {
        type: "recover",
        target: "stamina",
        value: 2
      }
    },
    {
      id: "FIALE_ANALGESICO",
      category: "consumable",
      rarity: "non_common",
      effect: {
        type: "recover",
        target: "health",
        value: 3,
        description: "Riduce temporaneamente il dolore, effetto immediato"
      }
    },
    {
      id: "ADRENALINA_GREZZA",
      category: "consumable",
      rarity: "non_common",
      effect: {
        type: "bonus",
        value: +5,
        description: "Bonus secco al prossimo tiro fisico o di scontro"
      }
    },
    {
      id: "FUSIBILE_RECUP",
      category: "consumable",
      rarity: "common",
      effect: {
        type: "bonus",
        value: +5,
        description: "Bonus secco al prossimo tiro tecnico"
      }
    }
  ]
};
