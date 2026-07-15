import { flattenForms } from "./practice-engine.js";

const FAMILY_LIMITS = {
  concept: { min: 0.45, max: 0.62 },
  verb: { min: 0.16, max: 0.28 },
  quest: { min: 0.12, max: 0.22 },
  popQuiz: { min: 0.04, max: 0.1 }
};

export function pickNextGameplayItem(resources, progress, now = Date.now(), random = Math.random) {
  const pools = buildDuePools(resources, progress, now);
  const availableFamilies = Object.entries(pools).filter(([, items]) => items.length > 0);

  if (availableFamilies.length === 0) {
    throw new Error("No gameplay items are available.");
  }

  const familyWeights = applyFamilyBounds(
    Object.fromEntries(availableFamilies.map(([family, items]) => [family, items.length]))
  );
  const family = pickWeighted(familyWeights, random);
  const item = pools[family][Math.floor(random() * pools[family].length)];
  return item;
}

export function buildDuePools(resources, progress, now = Date.now()) {
  const pools = buildGameplayPools(resources);
  const duePools = Object.fromEntries(
    Object.entries(pools).map(([family, items]) => [
      family,
      items.filter((item) => isDue(item, progress, now))
    ])
  );

  if (Object.values(duePools).some((items) => items.length > 0)) {
    return duePools;
  }

  return pools;
}

export function buildGameplayPools({ verbData, conceptData, serEstarQuest, nearPastQuest, smallWordsPopQuiz }) {
  return {
    concept: conceptData.items.map((challenge) => ({
      family: "concept",
      moduleKey: "concepts",
      itemKey: `concept:${challenge.id}`,
      challenge
    })),
    verb: verbData.items.flatMap((verb) =>
      flattenForms(verb).map((form) => ({
        family: "verb",
        moduleKey: "verbs",
        itemKey: `verb:${verb.id}:${form.id}`,
        verb,
        form
      }))
    ),
    quest: [
      ...serEstarQuest.items.map((question) => ({
        family: "quest",
        moduleKey: "quest.ser-estar",
        itemKey: `quest:ser-estar:${question.id}`,
        questId: serEstarQuest.id,
        quest: serEstarQuest,
        question
      })),
      ...nearPastQuest.items.map((question) => ({
        family: "quest",
        moduleKey: "quest.near-past",
        itemKey: `quest:near-past:${question.id}`,
        questId: nearPastQuest.id,
        quest: nearPastQuest,
        question
      }))
    ],
    popQuiz: smallWordsPopQuiz.items.map((question) => ({
      family: "popQuiz",
      moduleKey: "popQuiz.small-words",
      itemKey: `popQuiz:small-words:${question.id}`,
      quiz: smallWordsPopQuiz,
      question
    }))
  };
}

export function getModuleIntroState(progress, moduleKey) {
  return progress.seenModules?.[moduleKey] ? "returning" : "first";
}

function isDue(item, progress, now) {
  const record = progress.items?.[item.itemKey];
  if (!record?.nextDueAt) {
    return true;
  }

  return Date.parse(record.nextDueAt) <= now;
}

function applyFamilyBounds(counts) {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const bounded = Object.fromEntries(
    Object.entries(counts).map(([family, count]) => {
      const raw = count / total;
      const limits = FAMILY_LIMITS[family];
      return [family, Math.min(limits.max, Math.max(limits.min, raw))];
    })
  );

  const boundedTotal = Object.values(bounded).reduce((sum, weight) => sum + weight, 0);
  return Object.fromEntries(Object.entries(bounded).map(([family, weight]) => [family, weight / boundedTotal]));
}

function pickWeighted(weights, random) {
  const roll = random();
  let cumulative = 0;
  for (const [key, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (roll <= cumulative) {
      return key;
    }
  }

  return Object.keys(weights).at(-1);
}
