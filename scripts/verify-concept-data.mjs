import { readFile } from "node:fs/promises";

const concepts = JSON.parse(await readFile(new URL("../data/concepts.v1.json", import.meta.url), "utf8"));
const errors = [];
const expectedFamilies = {
  posicion: new Set(["encima de", "debajo de", "delante de", "detrás de", "dentro de", "fuera de", "entre", "cerca de", "lejos de"]),
  tiempo: new Set(["antes", "después", "durante", "mientras", "todavía", "ya"]),
  cantidad: new Set(["mucho", "poco", "demasiado", "suficiente", "casi"]),
  direccion: new Set(["hacia", "desde", "hasta", "por", "alrededor de"]),
  conexion: new Set(["porque", "aunque", "además", "entonces", "pero"])
};

if (concepts.version !== 1) {
  errors.push(`Expected concept version 1, got ${concepts.version}.`);
}

if (concepts.id !== "concepts") {
  errors.push(`Expected concept id concepts, got ${concepts.id}.`);
}

if (!Array.isArray(concepts.items) || concepts.items.length < 300) {
  errors.push(`Expected at least 300 concept challenges, got ${concepts.items?.length ?? "none"}.`);
}

const ids = new Set();
for (const item of concepts.items ?? []) {
  if (ids.has(item.id)) {
    errors.push(`Duplicate item id: ${item.id}.`);
  }
  ids.add(item.id);

  const familyConcepts = expectedFamilies[item.family];
  if (!familyConcepts) {
    errors.push(`${item.id} has unexpected family: ${item.family}.`);
  }

  if (!item.concept || !familyConcepts?.has(item.concept)) {
    errors.push(`${item.id} has unexpected concept: ${item.concept}.`);
  }

  if (!Array.isArray(item.examples) || item.examples.length !== 3) {
    errors.push(`${item.id} must have exactly 3 example sentences.`);
  }

  for (const example of item.examples ?? []) {
    if (!example.endsWith(".")) {
      errors.push(`${item.id} example must be a complete sentence: ${example}`);
    }
  }

  if (!Array.isArray(item.verbHints) || item.verbHints.length === 0) {
    errors.push(`${item.id} must have verb hints.`);
  }

  const exampleText = (item.examples ?? []).join(" ");
  const verbHintTerms = new Set();
  for (const example of item.examples ?? []) {
    if (!item.verbHints?.some((verbHint) => verbHint.term && example.includes(verbHint.term))) {
      errors.push(`${item.id} example must include at least one verb hint: ${example}`);
    }
  }

  for (const verbHint of item.verbHints ?? []) {
    if (!verbHint.term || typeof verbHint.term !== "string") {
      errors.push(`${item.id} has a verb hint without a term.`);
    }

    if (!verbHint.englishMeaning || typeof verbHint.englishMeaning !== "string") {
      errors.push(`${item.id} verb hint ${verbHint.term ?? "unknown"} must have an English meaning.`);
    }

    if (verbHint.term && verbHintTerms.has(verbHint.term)) {
      errors.push(`${item.id} has duplicate verb hint term: ${verbHint.term}`);
    }
    verbHintTerms.add(verbHint.term);

    if (verbHint.term && !exampleText.includes(verbHint.term)) {
      errors.push(`${item.id} verb hint term does not appear in examples: ${verbHint.term}`);
    }
  }

  if (!Array.isArray(item.choices) || item.choices.length !== 4) {
    errors.push(`${item.id} must have exactly 4 answer choices.`);
  }

  if (new Set(item.choices ?? []).size !== item.choices?.length) {
    errors.push(`${item.id} has duplicate choices.`);
  }

  if (!item.choices?.includes(item.correctAnswer)) {
    errors.push(`${item.id} correct answer must appear in choices.`);
  }

  if (!item.englishConcept || typeof item.englishConcept !== "string") {
    errors.push(`${item.id} must have an English concept translation.`);
  }

  if (item.correctAnswer !== item.concept) {
    errors.push(`${item.id} correct answer must match its concept.`);
  }

  for (const choice of item.choices ?? []) {
    if (!familyConcepts?.has(choice)) {
      errors.push(`${item.id} choice is outside family ${item.family}: ${choice}`);
    }
  }

  if (!item.hint?.endsWith(".")) {
    errors.push(`${item.id} hint must be a complete Spanish sentence.`);
  }

  if (!item.englishHint?.endsWith(".")) {
    errors.push(`${item.id} English hint must be a complete sentence.`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${concepts.items.length} concept challenges.`);
