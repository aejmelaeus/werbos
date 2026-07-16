export function createVerbSession(verb, random = Math.random, mode = pickRandomMode(random)) {
  const form = pickRandomForm(verb, random);
  return createVerbSessionForForm(verb, form, random, mode);
}

export function createVerbSessionForForm(verb, form, random = Math.random, mode = pickRandomMode(random)) {
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
    step: "meaning",
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

export function createQuestSession(quest, random = Math.random, selectedQuestion = null) {
  if (!quest?.items?.length) {
    throw new Error("No quest questions are available.");
  }

  const question = selectedQuestion ?? quest.items[Math.floor(random() * quest.items.length)];
  return {
    id: `${quest.id}.${question.id}.${Date.now()}`,
    mode: "quest",
    questId: quest.id,
    questTitle: quest.title,
    question,
    answers: shuffle(getQuestAnswers(question), random),
    step: "quest",
    status: "active"
  };
}

export function createNearPastQuestSession(quest, random = Math.random, selectedQuestion = null) {
  if (!quest?.items?.length) {
    throw new Error("No near-past quest questions are available.");
  }

  const question = selectedQuestion ?? quest.items[Math.floor(random() * quest.items.length)];
  return {
    id: `${quest.id}.${question.id}.${Date.now()}`,
    mode: "nearPastQuest",
    questId: quest.id,
    questTitle: quest.title,
    question,
    answers: shuffle(question.choices, random),
    step: "nearPastQuest",
    status: "active"
  };
}

export function createConceptSession(concepts, random = Math.random, selectedChallenge = null) {
  if (!concepts?.items?.length) {
    throw new Error("No concept challenges are available.");
  }

  const challenge = selectedChallenge ?? concepts.items[Math.floor(random() * concepts.items.length)];
  return {
    id: `${concepts.id}.${challenge.id}.${Date.now()}`,
    mode: "concept",
    conceptId: challenge.concept,
    challenge,
    answers: shuffle(challenge.choices, random),
    step: "concept",
    status: "active",
    hintVisible: false,
    misses: 0
  };
}

export function createPopQuizSession(popQuiz, random = Math.random, selectedQuestions = null) {
  if (!popQuiz?.items?.length) {
    throw new Error("No pop quiz questions are available.");
  }

  const sourceQuestions = selectedQuestions ?? shuffle(popQuiz.items, random);
  const questions = sourceQuestions.map((question) => ({
    ...question,
    answers: shuffle([question.correctAnswer, question.distractor], random)
  }));

  return {
    id: `${popQuiz.id}.${Date.now()}`,
    mode: "popQuiz",
    quizId: popQuiz.id,
    quizTitle: popQuiz.title,
    quiz: popQuiz,
    questions,
    currentIndex: 0,
    correctCount: 0,
    step: "popQuiz",
    status: "active"
  };
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

export function answerQuest(session, answer) {
  const correct = answer === getQuestCorrectAnswer(session.question);
  return {
    ...session,
    step: "result",
    status: correct ? "completed" : "failed",
    questResult: correct
  };
}

function getQuestAnswers(question) {
  if (Array.isArray(question.choices)) {
    return question.choices;
  }

  return [question.correct, ...question.distractors];
}

function getQuestCorrectAnswer(question) {
  return question.correctAnswer ?? question.correct;
}

export function answerNearPastQuest(session, answer) {
  const correct = answer === session.question.correctAnswer;
  return {
    ...session,
    step: "result",
    status: correct ? "completed" : "failed",
    questResult: correct
  };
}

export function answerConcept(session, answer) {
  const correct = answer === session.challenge.correctAnswer;
  return {
    ...session,
    step: correct ? "result" : "concept",
    status: correct ? "completed" : "active",
    conceptResult: correct,
    hintVisible: !correct,
    misses: correct ? session.misses : session.misses + 1
  };
}

export function answerPopQuiz(session, answer) {
  const question = session.questions[session.currentIndex];
  const correct = answer === question.correctAnswer;

  if (!correct) {
    return {
      ...session,
      step: "result",
      status: "failed",
      selectedAnswer: answer,
      failedQuestion: question,
      correctAnswer: question.correctAnswer
    };
  }

  const nextIndex = session.currentIndex + 1;
  const completed = nextIndex >= session.questions.length;
  return {
    ...session,
    currentIndex: nextIndex,
    correctCount: session.correctCount + 1,
    step: completed ? "result" : "popQuiz",
    status: completed ? "completed" : "active",
    selectedAnswer: answer
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
