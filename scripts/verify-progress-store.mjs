import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const tmpDir = new URL(".tmp-progress-verify/", root);

await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir);

try {
  const progressStore = await readFile(new URL("src/progress-store.js", root), "utf8");
  await writeFile(new URL("progress-store.mjs", tmpDir), progressStore);

  const storage = new Map();
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key)
  };

  const { loadProgress, markModuleSeen, recordAttempt } = await import(new URL("progress-store.mjs", tmpDir));
  const errors = [];
  let progress = loadProgress();

  progress = markModuleSeen(progress, "concepts");
  if (!progress.seenModules.concepts) {
    errors.push("Expected markModuleSeen to record concepts.");
  }

  progress = recordAttempt(progress, {
    mode: "concept",
    family: "concept",
    moduleKey: "concepts",
    itemKey: "concept:encima-de-01",
    conceptId: "encima de",
    challengeId: "encima-de-01",
    misses: 0,
    status: "completed"
  });
  const firstRecord = progress.items["concept:encima-de-01"];
  if (firstRecord.correctStreak !== 1 || firstRecord.missCount !== 0 || firstRecord.lastResult !== "completed") {
    errors.push("Expected first correct attempt to update item progress.");
  }

  progress = recordAttempt(progress, {
    mode: "concept",
    family: "concept",
    moduleKey: "concepts",
    itemKey: "concept:encima-de-01",
    conceptId: "encima de",
    challengeId: "encima-de-01",
    misses: 1,
    status: "failed"
  });
  const failedRecord = progress.items["concept:encima-de-01"];
  if (failedRecord.correctStreak !== 0 || failedRecord.missCount !== 1 || failedRecord.lastResult !== "failed") {
    errors.push("Expected failed attempt to reset correct streak and increment misses.");
  }

  storage.set("werbos.progress.v1", JSON.stringify({ version: 1, attempts: [] }));
  const migrated = loadProgress();
  if (!migrated.items || !migrated.seenModules || !("current" in migrated)) {
    errors.push("Expected old progress shape to normalize with new fields.");
  }

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log("Verified progress store scheduling and migration.");
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}
