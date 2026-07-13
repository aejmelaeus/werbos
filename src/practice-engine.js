export function createVerbSession(verb, random = Math.random, mode = pickRandomMode(random)) {
  const form = pickRandomForm(verb, random);
  const isReverse = mode === "reverse";
  return {
    id: `${verb.id}.${Date.now()}`,
    mode,
    verb,
    form,
    meaningAnswers: shuffle([verb.meaning.correct, ...verb.meaning.distractors], random),
    formAnswers: isReverse
      ? shuffle([form.spanish, ...pickSpanishSentenceDistractors(verb, form, random)], random)
      : shuffle([form.english, ...pickEnglishSentenceDistractors(verb, form, random)], random),
    step: isReverse ? "form" : "meaning",
    status: "active"
  };
}

export function pickRandomMode(random = Math.random) {
  return random() < 0.5 ? "forward" : "reverse";
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
  const expectedAnswer = session.mode === "reverse" ? session.form.spanish : session.form.english;
  const correct = answer === expectedAnswer;
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

function pickEnglishSentenceDistractors(verb, correctForm, random) {
  const candidates = flattenForms(verb)
    .filter((form) => form.id !== correctForm.id)
    .map((form) => form.english);

  return shuffle([...new Set(candidates)], random).slice(0, 3);
}

function pickSpanishSentenceDistractors(verb, correctForm, random) {
  const forms = flattenForms(verb).filter((form) => form.id !== correctForm.id);
  const otherTenseCandidates = forms
    .filter((form) => form.tense !== correctForm.tense)
    .map((form) => form.spanish);
  const sameTenseCandidates = forms
    .filter((form) => form.tense === correctForm.tense)
    .map((form) => form.spanish);
  const candidates = [
    ...shuffle([...new Set(otherTenseCandidates)], random),
    ...shuffle([...new Set(sameTenseCandidates)], random)
  ];

  return candidates.slice(0, 3);
}

function shuffle(items, random) {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}
