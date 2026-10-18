// Defaults only for exact published model IDs. Explicit endpoint/account limits
// take precedence, including proxies with smaller windows.
export function modelLimits(model) {
  if (/^(?:minimax\/)?MiniMax-M3$/i.test(String(model || ''))) return { contextWindow: 1_048_576, maxOutput: 32768 };
  return { contextWindow: 8192, maxOutput: 4096 };
}
export function effectiveLimits(record = {}) {
  const defaults = modelLimits(record.model);
  const contextWindow = record.contextWindow ?? defaults.contextWindow;
  const maxOutput = record.maxOutput ?? defaults.maxOutput;
  if (!Number.isSafeInteger(Number(contextWindow)) || Number(contextWindow) < 2048 || Number(contextWindow) > 16_777_216) throw new Error('contextWindow: expected an integer between 2048 and 16777216');
  if (!Number.isSafeInteger(Number(maxOutput)) || Number(maxOutput) < 256 || Number(maxOutput) >= Number(contextWindow)) throw new Error('maxOutput: expected an integer of at least 256 below contextWindow');
  return { contextWindow: Number(contextWindow), maxOutput: Number(maxOutput) };
}
