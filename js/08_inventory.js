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
    if (!item || !item.id) return;

    const alreadyHave = playerState.inventory.find(
      i => i.id === item.id
    );

    if (!alreadyHave) {
      playerState.inventory.push(item);
    }
  });

  /* ===== REMOVE ===== */
  if (inventoryRemove.length > 0) {
    playerState.inventory = playerState.inventory.filter(
      item => !inventoryRemove.includes(item.id)
    );
  }

  renderInventory();
}

/* ======================================================
   RENDER INVENTORY UI
   ====================================================== */
function renderInventory() {
  const listEl = document.getElementById("inventory-list");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (!playerState.inventory || playerState.inventory.length === 0) {
    const li = document.createElement("li");
    li.textContent = "— vuoto —";
    li.style.opacity = "0.6";
    listEl.appendChild(li);
    return;
  }

  playerState.inventory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.name || item.id;
    listEl.appendChild(li);
  });
}

/* ======================================================
   INIT INVENTORY UI
   ====================================================== */
function initInventoryUI() {
  renderInventory();
}

/* ======================================================
   EXPORT
   ====================================================== */
export {
  applyInventoryEffects,
  initInventoryUI,
  renderInventory
};
