/* ======================================================
   INVENTORY MANAGER
   ====================================================== */

import { playerState } from "./01_state.js";

/* ======================================================
   APPLICA EFFECTS DAL WORKER
   ====================================================== */
function applyInventoryEffects(effects = {}) {
  if (!effects || typeof effects !== "object") return;

  const {
    inventoryAdd = [],
    inventoryRemove = []
  } = effects;

  /* ===== ADD ===== */
  inventoryAdd.forEach(item => {
    if (!playerState.inventory.includes(item)) {
      playerState.inventory.push(item);
    }
  });

  /* ===== REMOVE ===== */
  if (inventoryRemove.length > 0) {
    playerState.inventory = playerState.inventory.filter(
      item => !inventoryRemove.includes(item)
    );
  }

  /* ===== RENDER ===== */
  if (typeof renderInventory === "function") {
    renderInventory(playerState.inventory);
  }
}

/* ======================================================
   INIT INVENTORY UI
   ====================================================== */
function initInventoryUI() {
  if (typeof renderInventory === "function") {
    renderInventory(playerState.inventory);
  }
}

export {
  applyInventoryEffects,
  initInventoryUI
};
