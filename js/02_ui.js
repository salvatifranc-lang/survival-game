function renderTestBox() {
  if (!testBox) return;

  // 🔍 DEBUG — stato reale letto dalla UI
  console.log("[UI getLastRoll]", getLastRoll());

  const {
    roll,
    risk,
    tag,
    modifier,
    modifierSource,
    outcome
  } = getLastRoll();

  // ✅ FIX 1: controllo semantico, non falsy
  if (roll == null || risk == null || outcome == null) {
    clearTestBox();
    return;
  }

  let modifierLine = "—";

  // ✅ FIX 2: consente modifier = 0
  if (modifier != null && modifierSource) {
    const sign = modifier > 0 ? "+" : "";
    modifierLine = `${sign}${modifier} (${modifierSource})`;
  }

  testBox.innerHTML =
    `🎲 Dado: <strong>${roll}</strong><br>` +
    `⚠️ Rischio: <strong>${riskLabel(risk)}</strong><br>` +
    `🏷️ Tipo: <strong>${tag || "—"}</strong><br>` +
    `🧰 Modificatore: <strong>${modifierLine}</strong><br>` +
    `🧪 Esito: <strong>${outcome}</strong>`;
}
