/* ======================================================
   INVENTORY MANAGER
   ====================================================== */
console.log("[08] inventory manager loaded");

import { playerState } from "./01_state.js";
import { START_ITEMS_POOL } from "./manuals/items_start_pool.js";

/* ======================================================
   BUILD OGGETTI CANONICI (LOOKUP)
   ====================================================== */

// Flatten di tutti gli oggetti disponibili nei manuali
const ALL_ITEMS = [
  ...(START_ITEMS_POOL.weapons || []),
  ...(START_ITEMS_POOL.tools || []),
  ...(START_ITEMS_POOL.consumables || [])
];

// Mappa id → oggetto completo
const ITEM_BY_ID = {};
ALL_ITEMS.forEach(item => {
  ITEM_BY_ID[item.id] = item;
});

/* ======================================================
   APPLICA EFFECTS DAL WORKER
   ====================================================== */
function applyInventoryEffects(effects = {}) {
  console.log("[INVENTORY] effects ricevuti:", effects);

  if (!effects || typeof effects !== "object") return;

  const {
    inventoryAdd = [],
    inventoryRemove = []
  } = effects;

  /* ===== ADD ===== */
  inventoryAdd.forEach(entry => {
    if (!entry || !entry.id) return;

    const canonicalItem = ITEM_BY_ID[entry.id];

    if (!canonicalItem) {
      console.warn(
        "[INVENTORY] oggetto NON valido ignorato:",
        entry.id
      );
      return;
    }

    const alreadyHave = playerState.inventory.find(
      i => i.id === canonicalItem.id
    );

    if (!alreadyHave) {
      // clone per evitare mutazioni globali
      const itemInstance = structuredClone(canonicalItem);
      playerState.inventory.push(itemInstance);
      console.log("[INVENTORY] aggiunto:", itemInstance);
    }
  });

  /* ===== REMOVE ===== */
  if (inventoryRemove.length > 0) {
    playerState.inventory = playerState.inventory.filter(
      item => !inventoryRemove.includes(item.id)
    );
    console.log("[INVENTORY] rimossi:", inventoryRemove);
  }

  /* ===== RENDER UI ===== */
  if (typeof window.renderInventory === "function") {
    window.renderInventory(playerState.inventory);
  } else {
    console.warn("[INVENTORY] renderInventory non disponibile");
  }
}

/* ======================================================
   INIT INVENTORY UI
   ====================================================== */
function initInventoryUI() {
  console.log("[INVENTORY] init UI");
  if (typeof window.renderInventory === "function") {
    window.renderInventory(playerState.inventory);
  }
}

/* ======================================================
   EXPORT
   ====================================================== */
export {
  applyInventoryEffects,
  initInventoryUI
};
