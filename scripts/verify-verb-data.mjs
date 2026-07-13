import { readFile } from "node:fs/promises";

const data = JSON.parse(await readFile(new URL("../data/verbs.v1.json", import.meta.url), "utf8"));
const errors = [];
const expectedTenses = ["present", "preterite", "imperfect", "perfect"];

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

  for (const tense of expectedTenses) {
    const forms = item.tenses?.[tense];
    if (!Array.isArray(forms) || forms.length !== 6) {
      errors.push(`Expected 6 ${tense} forms for ${item.id}.`);
      continue;
    }

    for (const form of forms) {
      if (formIds.has(form.id)) {
        errors.push(`Duplicate form id: ${form.id}.`);
      }
      formIds.add(form.id);

      if (!form.id.startsWith(`${item.id}.${tense}.`)) {
        errors.push(`${form.id} does not use the expected ${item.id}.${tense} id prefix.`);
      }

      if (!form.spanish?.includes(form.form)) {
        errors.push(`${form.id} Spanish sentence does not include form "${form.form}".`);
      }

      if (!form.spanish?.endsWith(".") || !form.english?.endsWith(".")) {
        errors.push(`${form.id} sentences must end with periods.`);
      }
    }
  }
}

if (formIds.size !== 2400) {
  errors.push(`Expected 2400 unique forms, got ${formIds.size}.`);
}

const expectedForms = {
  ser: {
    present: "soy|eres|es|somos|sois|son",
    preterite: "fui|fuiste|fue|fuimos|fuisteis|fueron",
    imperfect: "era|eras|era|\u00e9ramos|erais|eran",
    perfect: "he sido|has sido|ha sido|hemos sido|hab\u00e9is sido|han sido"
  },
  haber: {
    present: "he|has|ha|hemos|hab\u00e9is|han",
    preterite: "hube|hubiste|hubo|hubimos|hubisteis|hubieron",
    imperfect: "hab\u00eda|hab\u00edas|hab\u00eda|hab\u00edamos|hab\u00edais|hab\u00edan",
    perfect: "he habido|has habido|ha habido|hemos habido|hab\u00e9is habido|han habido"
  },
  estar: {
    present: "estoy|est\u00e1s|est\u00e1|estamos|est\u00e1is|est\u00e1n",
    preterite: "estuve|estuviste|estuvo|estuvimos|estuvisteis|estuvieron",
    imperfect: "estaba|estabas|estaba|est\u00e1bamos|estabais|estaban",
    perfect: "he estado|has estado|ha estado|hemos estado|hab\u00e9is estado|han estado"
  },
  tener: {
    present: "tengo|tienes|tiene|tenemos|ten\u00e9is|tienen",
    preterite: "tuve|tuviste|tuvo|tuvimos|tuvisteis|tuvieron",
    imperfect: "ten\u00eda|ten\u00edas|ten\u00eda|ten\u00edamos|ten\u00edais|ten\u00edan",
    perfect: "he tenido|has tenido|ha tenido|hemos tenido|hab\u00e9is tenido|han tenido"
  },
  hacer: {
    present: "hago|haces|hace|hacemos|hac\u00e9is|hacen",
    preterite: "hice|hiciste|hizo|hicimos|hicisteis|hicieron",
    imperfect: "hac\u00eda|hac\u00edas|hac\u00eda|hac\u00edamos|hac\u00edais|hac\u00edan",
    perfect: "he hecho|has hecho|ha hecho|hemos hecho|hab\u00e9is hecho|han hecho"
  },
  decir: {
    present: "digo|dices|dice|decimos|dec\u00eds|dicen",
    preterite: "dije|dijiste|dijo|dijimos|dijisteis|dijeron",
    imperfect: "dec\u00eda|dec\u00edas|dec\u00eda|dec\u00edamos|dec\u00edais|dec\u00edan",
    perfect: "he dicho|has dicho|ha dicho|hemos dicho|hab\u00e9is dicho|han dicho"
  },
  ir: {
    present: "voy|vas|va|vamos|vais|van",
    preterite: "fui|fuiste|fue|fuimos|fuisteis|fueron",
    imperfect: "iba|ibas|iba|\u00edbamos|ibais|iban",
    perfect: "he ido|has ido|ha ido|hemos ido|hab\u00e9is ido|han ido"
  },
  ver: {
    present: "veo|ves|ve|vemos|veis|ven",
    preterite: "vi|viste|vio|vimos|visteis|vieron",
    imperfect: "ve\u00eda|ve\u00edas|ve\u00eda|ve\u00edamos|ve\u00edais|ve\u00edan",
    perfect: "he visto|has visto|ha visto|hemos visto|hab\u00e9is visto|han visto"
  },
  dar: {
    present: "doy|das|da|damos|dais|dan",
    preterite: "di|diste|dio|dimos|disteis|dieron",
    imperfect: "daba|dabas|daba|d\u00e1bamos|dabais|daban",
    perfect: "he dado|has dado|ha dado|hemos dado|hab\u00e9is dado|han dado"
  },
  poder: {
    present: "puedo|puedes|puede|podemos|pod\u00e9is|pueden",
    preterite: "pude|pudiste|pudo|pudimos|pudisteis|pudieron",
    imperfect: "pod\u00eda|pod\u00edas|pod\u00eda|pod\u00edamos|pod\u00edais|pod\u00edan",
    perfect: "he podido|has podido|ha podido|hemos podido|hab\u00e9is podido|han podido"
  },
  traer: {
    present: "traigo|traes|trae|traemos|tra\u00e9is|traen",
    preterite: "traje|trajiste|trajo|trajimos|trajisteis|trajeron",
    imperfect: "tra\u00eda|tra\u00edas|tra\u00eda|tra\u00edamos|tra\u00edais|tra\u00edan",
    perfect: "he tra\u00eddo|has tra\u00eddo|ha tra\u00eddo|hemos tra\u00eddo|hab\u00e9is tra\u00eddo|han tra\u00eddo"
  },
  leer: {
    present: "leo|lees|lee|leemos|le\u00e9is|leen",
    preterite: "le\u00ed|le\u00edste|ley\u00f3|le\u00edmos|le\u00edsteis|leyeron",
    imperfect: "le\u00eda|le\u00edas|le\u00eda|le\u00edamos|le\u00edais|le\u00edan",
    perfect: "he le\u00eddo|has le\u00eddo|ha le\u00eddo|hemos le\u00eddo|hab\u00e9is le\u00eddo|han le\u00eddo"
  },
  oir: {
    present: "oigo|oyes|oye|o\u00edmos|o\u00eds|oyen",
    preterite: "o\u00ed|o\u00edste|oy\u00f3|o\u00edmos|o\u00edsteis|oyeron",
    imperfect: "o\u00eda|o\u00edas|o\u00eda|o\u00edamos|o\u00edais|o\u00edan",
    perfect: "he o\u00eddo|has o\u00eddo|ha o\u00eddo|hemos o\u00eddo|hab\u00e9is o\u00eddo|han o\u00eddo"
  },
  jugar: {
    present: "juego|juegas|juega|jugamos|jug\u00e1is|juegan",
    preterite: "jugu\u00e9|jugaste|jug\u00f3|jugamos|jugasteis|jugaron",
    imperfect: "jugaba|jugabas|jugaba|jug\u00e1bamos|jugabais|jugaban",
    perfect: "he jugado|has jugado|ha jugado|hemos jugado|hab\u00e9is jugado|han jugado"
  },
  repetir: {
    present: "repito|repites|repite|repetimos|repet\u00eds|repiten",
    preterite: "repet\u00ed|repetiste|repiti\u00f3|repetimos|repetisteis|repitieron",
    imperfect: "repet\u00eda|repet\u00edas|repet\u00eda|repet\u00edamos|repet\u00edais|repet\u00edan",
    perfect: "he repetido|has repetido|ha repetido|hemos repetido|hab\u00e9is repetido|han repetido"
  }
};

for (const [id, expectedByTense] of Object.entries(expectedForms)) {
  const item = data.items?.find((verb) => verb.id === id);
  for (const [tense, expected] of Object.entries(expectedByTense)) {
    const actual = item?.tenses[tense].map((form) => form.form).join("|");
    if (actual !== expected) {
      errors.push(`${id}.${tense}: expected ${expected}, got ${actual}.`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${data.items.length} verbs and ${formIds.size} forms across ${expectedTenses.length} tenses.`);
