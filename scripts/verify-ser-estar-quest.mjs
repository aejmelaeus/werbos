import { readFile } from "node:fs/promises";

const quest = JSON.parse(await readFile(new URL("../data/quests/ser-estar.v1.json", import.meta.url), "utf8"));
const errors = [];
const expectedKinds = new Set([
  "identity",
  "location",
  "trait",
  "state",
  "origin",
  "condition",
  "time",
  "action",
  "material",
  "event",
  "description",
  "feeling",
  "reason"
]);
const serForms = ["es", "son", "soy", "eres", "somos", "sois"];
const estarForms = ["estoy", "estás", "está", "estamos", "estáis", "están"];

if (quest.version !== 1) {
  errors.push(`Expected quest version 1, got ${quest.version}.`);
}

if (quest.id !== "ser-estar") {
  errors.push(`Expected quest id ser-estar, got ${quest.id}.`);
}

if (!Array.isArray(quest.items) || quest.items.length < 60) {
  errors.push(`Expected at least 60 quest items, got ${quest.items?.length ?? "none"}.`);
}

const reasonItemCount = (quest.items ?? []).filter((item) => item.kind === "reason").length;
if (reasonItemCount !== 50) {
  errors.push(`Expected exactly 50 ser/estar reason items, got ${reasonItemCount}.`);
}

const ids = new Set();
for (const item of quest.items ?? []) {
  if (ids.has(item.id)) {
    errors.push(`Duplicate item id: ${item.id}.`);
  }
  ids.add(item.id);

  if (!expectedKinds.has(item.kind)) {
    errors.push(`${item.id} has unexpected kind: ${item.kind}.`);
  }

  if (item.kind === "reason") {
    validateReasonItem(item);
    continue;
  }

  validateSentenceChoiceItem(item);
}

function validateSentenceChoiceItem(item) {
  if (!item.prompt?.endsWith(".")) {
    errors.push(`${item.id} prompt must be a complete sentence.`);
  }

  if (!item.clue || typeof item.clue !== "string") {
    errors.push(`${item.id} must have a clue label.`);
  }

  if (!item.correct?.endsWith(".")) {
    errors.push(`${item.id} correct answer must be a complete sentence.`);
  }

  if (!Array.isArray(item.distractors) || item.distractors.length !== 3) {
    errors.push(`${item.id} must have exactly 3 distractors.`);
  }

  const answers = [item.correct, ...(item.distractors ?? [])];
  if (new Set(answers).size !== answers.length) {
    errors.push(`${item.id} has duplicate answer text.`);
  }

  if (!answers.some((answer) => containsAnyWord(answer, serForms))) {
    errors.push(`${item.id} does not include a ser-form answer.`);
  }

  if (!answers.some((answer) => containsAnyWord(answer, estarForms))) {
    errors.push(`${item.id} does not include an estar-form answer.`);
  }

  if (!item.explanation?.match(/\bser\b|\bestar\b/i)) {
    errors.push(`${item.id} explanation should mention ser or estar.`);
  }
}

function validateReasonItem(item) {
  if (!item.sentence?.endsWith(".")) {
    errors.push(`${item.id} sentence must be a complete sentence.`);
  }

  if (!item.prompt || typeof item.prompt !== "string") {
    errors.push(`${item.id} must have a prompt.`);
  }

  if (!item.clue || typeof item.clue !== "string") {
    errors.push(`${item.id} must have a clue label.`);
  }

  if (!Array.isArray(item.choices) || item.choices.length !== 3) {
    errors.push(`${item.id} must have exactly 3 reason choices.`);
  }

  if (!item.choices?.includes(item.correctAnswer)) {
    errors.push(`${item.id} correct answer must appear in choices.`);
  }

  if (new Set(item.choices ?? []).size !== item.choices?.length) {
    errors.push(`${item.id} has duplicate reason choices.`);
  }

  if (!mentionsSerOrEstar(item.correctAnswer)) {
    errors.push(`${item.id} correct answer should mention ser or estar.`);
  }

  if (!mentionsSerOrEstar(item.explanation)) {
    errors.push(`${item.id} explanation should mention ser or estar.`);
  }

  if (!Array.isArray(item.keywordHints) || item.keywordHints.length === 0) {
    errors.push(`${item.id} must have keyword hints.`);
  }

  const keywordTerms = new Set();
  for (const keywordHint of item.keywordHints ?? []) {
    if (!keywordHint.term || typeof keywordHint.term !== "string") {
      errors.push(`${item.id} has a keyword hint without a term.`);
    }

    if (!keywordHint.hint || typeof keywordHint.hint !== "string") {
      errors.push(`${item.id} keyword hint ${keywordHint.term ?? "unknown"} must have hint text.`);
    }

    if (keywordHint.term && keywordTerms.has(keywordHint.term)) {
      errors.push(`${item.id} has duplicate keyword hint term: ${keywordHint.term}`);
    }
    keywordTerms.add(keywordHint.term);

    if (keywordHint.term && !item.sentence?.includes(keywordHint.term)) {
      errors.push(`${item.id} keyword hint term does not appear in sentence: ${keywordHint.term}`);
    }
  }
}

function containsAnyWord(text, words) {
  const normalized = text.toLocaleLowerCase("es-ES");
  return words.some((word) => normalized.split(/[\s.,!?¿¡]+/u).includes(word));
}

function mentionsSerOrEstar(text) {
  const normalized = text?.toLocaleLowerCase("es-ES") ?? "";
  return ["ser", "estar", "est", " es ", " son ", "soy", "somos"].some((word) => normalized.includes(word));
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${quest.items.length} ser/estar quest questions.`);
