// Fail closed. --yes covers only file writes and shell, never questions or passwords.
export function closedDecision() {
  return { accept: false, cancel: false };
}

export function yesDecision(pause) {
  if (pause?.kind === "change" || pause?.kind === "approval") return { accept: true };
  return { accept: false, cancel: true };
}

export function normalizeDecision(pause, decision) {
  if (!decision || decision.cancel) return { accept: false, cancel: true };
  if (pause?.kind === "choice") {
    const index = Number(decision.index);
    if (!Number.isInteger(index) || index < 0 || index >= (pause.options?.length || 0)) {
      return { accept: false, cancel: true };
    }
    return { index, cancel: false };
  }
  if (pause?.kind === "secret") return { accept: false, cancel: true };
  return { accept: Boolean(decision.accept), cancel: false };
}
