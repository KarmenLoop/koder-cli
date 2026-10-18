import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { KoderError } from "./errors.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));

// A live koder-desktop checkout wins over the bundled copy in kernel/.
export function kernelRoot(env = process.env) {
  if (env.KODER_DESKTOP_ROOT) return path.resolve(env.KODER_DESKTOP_ROOT);
  const sibling = path.resolve(here, "..", "..", "koder-desktop");
  if (fs.existsSync(path.join(sibling, "harness", "create.mjs"))) return sibling;
  return path.resolve(here, "..", "kernel");
}

export async function importKernel(file, env = process.env) {
  const root = kernelRoot(env);
  const entry = path.join(root, file);
  if (!fs.existsSync(entry)) throw new KoderError("err.kernel", { path: root });
  return import(pathToFileURL(entry).href);
}

// The record goes into the harness's own settings so the context window follows
// the real model instead of the 8192-token default used for an override.
export async function openAgent({ workspace, record = null, providerOverride = null, fetchImpl, contextRatio = 0.75, env = process.env }) {
  const { createHarness } = await importKernel(path.join("harness", "create.mjs"), env);
  const harness = await createHarness({ workspace, providerOverride, fetchImpl });
  if (record) {
    await harness.store.saveProviders([{ ...record, id: "cli" }]);
    await harness.store.saveSettings({ providerId: "cli", contextRatio });
  } else {
    await harness.store.saveSettings({ contextRatio });
  }
  return harness;
}

export function watcher(harness) {
  const handlers = new Map();
  harness.setUpdateListener((thread) => handlers.get(thread.id)?.(thread));
  return {
    on(id, handler) {
      handlers.set(id, handler);
      return () => handlers.delete(id);
    },
  };
}

export async function openThread(harness, { mode = "standard", interaction = "agent" } = {}) {
  const thread = harness.createThread();
  thread.mode = mode;
  thread.interaction = interaction;
  await harness.addThread(thread);
  return thread;
}
