import { readFile } from "node:fs/promises";

const quest = JSON.parse(await readFile(new URL("../data/quests/near-past.v1.json", import.meta.url), "utf8"));
const errors = [];
const helpersByPerson = {
  Yo: "he",
  "Tú": "has",
  "Él / Ella": "ha",
  Nosotros: "hemos",
  Vosotros: "habéis",
  "Ellos / Ellas": "han"
};
const helperValues = new Set(Object.values(helpersByPerson));

if (quest.version !== 1) {
  errors.push(`Expected quest version 1, got ${quest.version}.`);
}

if (quest.id !== "near-past") {
  errors.push(`Expected quest id near-past, got ${quest.id}.`);
}

if (!Array.isArray(quest.items) || quest.items.length < 10) {
  errors.push(`Expected at least 10 near-past items, got ${quest.items?.length ?? "none"}.`);
}

const ids = new Set();
for (const item of quest.items ?? []) {
  if (ids.has(item.id)) {
    errors.push(`Duplicate item id: ${item.id}.`);
  }
  ids.add(item.id);

  if (!["who", "helper"].includes(item.kind)) {
    errors.push(`${item.id} has unexpected kind: ${item.kind}.`);
  }

  if (!item.phrase || typeof item.phrase !== "string") {
    errors.push(`${item.id} must have a phrase.`);
  }

  if (!item.question || typeof item.question !== "string") {
    errors.push(`${item.id} must have a question.`);
  }

  if (!Array.isArray(item.choices) || item.choices.length !== 4) {
    errors.push(`${item.id} must have exactly 4 choices.`);
  }

  if (new Set(item.choices ?? []).size !== item.choices?.length) {
    errors.push(`${item.id} has duplicate choices.`);
  }

  if (!item.choices?.includes(item.correctAnswer)) {
    errors.push(`${item.id} correct answer must appear in choices.`);
  }

  if (!helperValues.has(item.helper)) {
    errors.push(`${item.id} has unexpected helper: ${item.helper}.`);
  }

  if (!item.actionWord || typeof item.actionWord !== "string") {
    errors.push(`${item.id} must have an action word.`);
  }

  if (!item.explanation?.endsWith(".")) {
    errors.push(`${item.id} explanation must be a complete sentence.`);
  }

  if (item.kind === "who") {
    if (!helpersByPerson[item.correctAnswer]) {
      errors.push(`${item.id} who-item answer must be a supported person.`);
    } else if (helpersByPerson[item.correctAnswer] !== item.helper) {
      errors.push(`${item.id} helper ${item.helper} does not match ${item.correctAnswer}.`);
    }

    if (!item.phrase.toLocaleLowerCase("es-ES").startsWith(item.helper)) {
      errors.push(`${item.id} phrase should start with helper ${item.helper}.`);
    }
  }

  if (item.kind === "helper") {
    if (!helpersByPerson[item.phrase]) {
      errors.push(`${item.id} helper-item phrase must be a supported person.`);
    } else if (helpersByPerson[item.phrase] !== item.correctAnswer) {
      errors.push(`${item.id} correct answer ${item.correctAnswer} does not match ${item.phrase}.`);
    }
  }
}

const kinds = new Set((quest.items ?? []).map((item) => item.kind));
if (!kinds.has("who") || !kinds.has("helper")) {
  errors.push("Near-past quest must include both who and helper items.");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${quest.items.length} near-past quest questions.`);
