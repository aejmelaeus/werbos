import { readFile } from "node:fs/promises";

const data = JSON.parse(await readFile(new URL("../data/verbs.v1.json", import.meta.url), "utf8"));
const errors = [];

if (data.version !== 1) {
  errors.push(`Expected data version 1, got ${data.version}.`);
}

if (!Array.isArray(data.items) || data.items.length !== 100) {
  errors.push(`Expected 100 verbs, got ${data.items?.length ?? "none"}.`);
}

const verbIds = new Set();
const formIds = new Set();
for (const item of data.items ?? []) {
  if (verbIds.has(item.id)) {
    errors.push(`Duplicate verb id: ${item.id}.`);
  }
  verbIds.add(item.id);

  if (!Number.isInteger(item.rank) || item.rank < 1 || item.rank > 100) {
    errors.push(`Invalid rank for ${item.id}: ${item.rank}.`);
  }

  if (!item.meaning?.correct || item.meaning.distractors?.length !== 3) {
    errors.push(`Invalid meaning answers for ${item.id}.`);
  }

  const present = item.tenses?.present;
  if (!Array.isArray(present) || present.length !== 6) {
    errors.push(`Expected 6 present forms for ${item.id}.`);
    continue;
  }

  for (const form of present) {
    if (formIds.has(form.id)) {
      errors.push(`Duplicate form id: ${form.id}.`);
    }
    formIds.add(form.id);

    if (!form.spanish?.includes(form.form)) {
      errors.push(`${form.id} Spanish sentence does not include form "${form.form}".`);
    }

    if (!form.english?.endsWith(".")) {
      errors.push(`${form.id} English sentence must end with a period.`);
    }
  }
}

const expectedPresentForms = {
  ser: "soy|eres|es|somos|sois|son",
  haber: "he|has|ha|hemos|hab\u00e9is|han",
  estar: "estoy|est\u00e1s|est\u00e1|estamos|est\u00e1is|est\u00e1n",
  tener: "tengo|tienes|tiene|tenemos|ten\u00e9is|tienen",
  hacer: "hago|haces|hace|hacemos|hac\u00e9is|hacen",
  poder: "puedo|puedes|puede|podemos|pod\u00e9is|pueden",
  decir: "digo|dices|dice|decimos|dec\u00eds|dicen",
  ir: "voy|vas|va|vamos|vais|van",
  ver: "veo|ves|ve|vemos|veis|ven",
  dar: "doy|das|da|damos|dais|dan",
  saber: "s\u00e9|sabes|sabe|sabemos|sab\u00e9is|saben",
  querer: "quiero|quieres|quiere|queremos|quer\u00e9is|quieren",
  seguir: "sigo|sigues|sigue|seguimos|segu\u00eds|siguen",
  encontrar: "encuentro|encuentras|encuentra|encontramos|encontr\u00e1is|encuentran",
  venir: "vengo|vienes|viene|venimos|ven\u00eds|vienen",
  pensar: "pienso|piensas|piensa|pensamos|pens\u00e1is|piensan",
  oir: "oigo|oyes|oye|o\u00edmos|o\u00eds|oyen",
  jugar: "juego|juegas|juega|jugamos|jug\u00e1is|juegan",
  repetir: "repito|repites|repite|repetimos|repet\u00eds|repiten"
};

for (const [id, expected] of Object.entries(expectedPresentForms)) {
  const actual = data.items
    ?.find((item) => item.id === id)
    ?.tenses.present.map((form) => form.form)
    .join("|");

  if (actual !== expected) {
    errors.push(`${id}: expected ${expected}, got ${actual}.`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${data.items.length} verbs and ${formIds.size} present-tense forms.`);
