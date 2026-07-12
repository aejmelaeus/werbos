export function createVerbSession(verb, random = Math.random) {
  const form = pickRandomForm(verb, random);
  return {
    id: `${verb.id}.${Date.now()}`,
    verb,
    form,
    meaningAnswers: shuffle([verb.meaning.correct, ...verb.meaning.distractors], random),
    formAnswers: shuffle([form.english, ...pickSentenceDistractors(verb, form, random)], random),
    step: "meaning",
    status: "active"
  };
}

export function pickRandomVerb(verbs, random = Math.random) {
  if (!Array.isArray(verbs) || verbs.length === 0) {
    throw new Error("No verbs are available for practice.");
  }
  return verbs[Math.floor(random() * verbs.length)];
}

export function answerMeaning(session, answer) {
  const correct = answer === session.verb.meaning.correct;
  return {
    ...session,
    step: correct ? "form" : "result",
    status: correct ? "active" : "failed",
    meaningResult: correct
  };
}

export function answerForm(session, answer) {
  const correct = answer === session.form.english;
  return {
    ...session,
    step: "result",
    status: correct ? "completed" : "failed",
    formResult: correct
  };
}

export function flattenForms(verb) {
  return Object.entries(verb.tenses).flatMap(([tense, forms]) =>
    forms.map((form) => ({
      ...form,
      tense
    }))
  );
}

function pickRandomForm(verb, random) {
  const forms = flattenForms(verb);
  return forms[Math.floor(random() * forms.length)];
}

function pickSentenceDistractors(verb, correctForm, random) {
  const candidates = flattenForms(verb)
    .filter((form) => form.id !== correctForm.id)
    .map((form) => form.english);

  return shuffle([...new Set(candidates)], random).slice(0, 3);
}

function shuffle(items, random) {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}
