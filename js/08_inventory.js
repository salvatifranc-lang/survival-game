/* ======================================================
   INVENTORY MANAGER
   ====================================================== */

import { playerState } from "./01_state.js";

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
  inventoryAdd.forEach(item => {
    if (!item || !item.id) return;

    const alreadyHave = playerState.inventory.find(
      i => i.id === item.id
    );

    if (!alreadyHave) {
      playerState.inventory.push(item);
      console.log("[INVENTORY] aggiunto:", item);
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
