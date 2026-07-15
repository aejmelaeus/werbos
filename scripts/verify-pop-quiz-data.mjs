import { readFile } from "node:fs/promises";

const popQuiz = JSON.parse(await readFile(new URL("../data/pop-quizzes/small-words.v1.json", import.meta.url), "utf8"));
const errors = [];
const expectedWords = new Set(["a", "de", "en", "con", "sin", "por", "y", "e", "o", "u", "ni"]);
const expectedDirections = new Set(["word-to-meaning", "meaning-to-word"]);

if (popQuiz.version !== 1) {
  errors.push(`Expected pop quiz version 1, got ${popQuiz.version}.`);
}

if (popQuiz.id !== "small-words") {
  errors.push(`Expected pop quiz id small-words, got ${popQuiz.id}.`);
}

for (const field of ["title", "description", "introMessage", "successMessage", "failureMessage"]) {
  if (!popQuiz[field] || typeof popQuiz[field] !== "string") {
    errors.push(`Pop quiz must have ${field}.`);
  }
}

if (!Array.isArray(popQuiz.items) || popQuiz.items.length < expectedWords.size) {
  errors.push(`Expected at least ${expectedWords.size} pop quiz items, got ${popQuiz.items?.length ?? "none"}.`);
}

const ids = new Set();
const words = new Set();
for (const item of popQuiz.items ?? []) {
  if (ids.has(item.id)) {
    errors.push(`Duplicate pop quiz item id: ${item.id}.`);
  }
  ids.add(item.id);
  words.add(item.word);

  for (const field of ["id", "direction", "word", "english", "prompt", "correctAnswer", "distractor", "example", "explanation"]) {
    if (!item[field] || typeof item[field] !== "string") {
      errors.push(`${item.id ?? "unknown"} must have string field ${field}.`);
    }
  }

  if (!expectedDirections.has(item.direction)) {
    errors.push(`${item.id} has unexpected direction: ${item.direction}.`);
  }

  if (item.direction === "word-to-meaning" && item.prompt !== item.word) {
    errors.push(`${item.id} word-to-meaning prompt must be the Spanish word.`);
  }

  if (item.direction === "word-to-meaning" && item.correctAnswer !== item.english) {
    errors.push(`${item.id} word-to-meaning correctAnswer must match english.`);
  }

  if (item.direction === "meaning-to-word" && item.prompt !== item.english) {
    errors.push(`${item.id} meaning-to-word prompt must be the English meaning.`);
  }

  if (item.direction === "meaning-to-word" && item.correctAnswer !== item.word) {
    errors.push(`${item.id} meaning-to-word correctAnswer must match word.`);
  }

  if (item.correctAnswer === item.distractor) {
    errors.push(`${item.id} must have a different distractor.`);
  }

  if (!item.example?.endsWith(".")) {
    errors.push(`${item.id} example must be a complete sentence.`);
  }

  if (!item.explanation?.endsWith(".")) {
    errors.push(`${item.id} explanation must be a complete sentence.`);
  }
}

for (const word of expectedWords) {
  if (!words.has(word)) {
    errors.push(`Missing requested small word: ${word}.`);
  }
}

for (const word of words) {
  const directions = new Set((popQuiz.items ?? []).filter((item) => item.word === word).map((item) => item.direction));
  for (const direction of expectedDirections) {
    if (!directions.has(direction)) {
      errors.push(`Missing ${direction} item for word: ${word}.`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${popQuiz.items.length} small-words pop quiz questions.`);
