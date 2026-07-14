import { readFile } from "node:fs/promises";

const engineSource = await readFile(new URL("../src/practice-engine.js", import.meta.url), "utf8");
const errors = [];

if (!engineSource.includes('step: "meaning"')) {
  errors.push("createVerbSession should initialize sessions at the meaning step.");
}

if (engineSource.includes('step: isReverse ? "form" : "meaning"')) {
  errors.push("createVerbSession must not skip meaning for reverse sessions.");
}

if (!engineSource.includes('step: correct ? "form" : "result"')) {
  errors.push("answerMeaning should continue to the form step after a correct meaning answer.");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Verified verb flow guards: meaning starts every session and correct meaning continues to form.");
