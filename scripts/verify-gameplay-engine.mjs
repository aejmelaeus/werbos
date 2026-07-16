import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const tmpDir = new URL(".tmp-gameplay-verify/", root);

await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir);

try {
  const practiceEngine = await readFile(new URL("src/practice-engine.js", root), "utf8");
  const gameplayEngine = (await readFile(new URL("src/gameplay-engine.js", root), "utf8")).replace(
    "./practice-engine.js",
    "./practice-engine.mjs"
  );
  await writeFile(new URL("practice-engine.mjs", tmpDir), practiceEngine);
  await writeFile(new URL("gameplay-engine.mjs", tmpDir), gameplayEngine);

  const { buildDuePools, buildGameplayPools, pickNextGameplayItem } = await import(
    new URL("gameplay-engine.mjs", tmpDir)
  );
  const resources = {
    verbData: await readJson("data/verbs.v1.json"),
    conceptData: await readJson("data/concepts.v1.json"),
    serEstarQuest: await readJson("data/quests/ser-estar.v1.json"),
    nearPastQuest: await readJson("data/quests/near-past.v1.json"),
    smallWordsPopQuiz: await readJson("data/pop-quizzes/small-words.v1.json")
  };
  const pools = buildGameplayPools(resources);
  const counts = Object.fromEntries(Object.entries(pools).map(([family, items]) => [family, items.length]));
  const errors = [];

  assertEqual(errors, counts.concept, 300, "Expected 300 concept gameplay items.");
  assertEqual(errors, counts.verb, 2400, "Expected one gameplay item per verb form.");
  assertEqual(errors, counts.quest, 74, "Expected 74 quest gameplay items.");
  assertEqual(errors, counts.popQuiz, 10, "Expected 10 pop quiz gameplay items.");

  const now = Date.parse("2026-07-15T00:00:00.000Z");
  const firstConcept = pools.concept[0];
  const duePools = buildDuePools(
    resources,
    {
      items: {
        [firstConcept.itemKey]: {
          nextDueAt: "2026-07-16T00:00:00.000Z"
        }
      }
    },
    now
  );
  assertEqual(errors, duePools.concept.length, counts.concept - 1, "Future scheduled concept should not be due.");

  const pickedByLowRoll = pickNextGameplayItem(resources, { items: {} }, now, () => 0);
  assertEqual(errors, pickedByLowRoll.family, "concept", "Lowest roll should pick the first weighted family.");

  const pickedByHighRoll = pickNextGameplayItem(resources, { items: {} }, now, () => 0.99);
  assertEqual(errors, pickedByHighRoll.family, "popQuiz", "Highest roll should still reach bounded pop quiz items.");

  const continuedFamily = pickNextGameplayItem(
    resources,
    { items: {}, current: { family: "concept", familyRunCount: 2 } },
    now,
    () => 0.99
  );
  assertEqual(errors, continuedFamily.family, "concept", "Family run under 3 should continue the same family.");

  const switchAllowed = pickNextGameplayItem(
    resources,
    { items: {}, current: { family: "concept", familyRunCount: 3 } },
    now,
    () => 0.99
  );
  assertEqual(errors, switchAllowed.family, "popQuiz", "Family run of 3 should allow weighted switching.");

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log(`Verified gameplay engine pools: ${JSON.stringify(counts)}.`);
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, root), "utf8"));
}

function assertEqual(errors, actual, expected, message) {
  if (actual !== expected) {
    errors.push(`${message} Got ${actual}, expected ${expected}.`);
  }
}
