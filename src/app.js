import { loadConceptData, loadSerEstarQuest, loadVerbData } from "./data-loader.js";
import {
  answerConcept,
  answerForm,
  answerMeaning,
  answerQuest,
  createConceptSession,
  createQuestSession,
  createVerbSession,
  pickRandomVerb
} from "./practice-engine.js";
import { loadProgress, recordAttempt } from "./progress-store.js";

const app = document.querySelector("#app");
const sounds = {
  success: new Audio("./design/sounds/werbos-success.wav"),
  failure: new Audio("./design/sounds/werbos-failure.wav")
};

let verbData;
let serEstarQuest;
let conceptData;
let session;
let progress = loadProgress();

init();

async function init() {
  renderLoading();
  try {
    [verbData, serEstarQuest, conceptData] = await Promise.all([loadVerbData(), loadSerEstarQuest(), loadConceptData()]);
    if (shouldStartSerEstarQuest()) {
      renderQuestIntro("replace");
      return;
    }
    if (shouldStartConcepts()) {
      renderConceptIntro("replace");
      return;
    }
    renderStart();
  } catch (error) {
    renderError(error);
  }
}

function renderStart() {
  const attempts = progress.attempts.length;
  const verbCount = verbData.items.length;
  const isReturningPlayer = attempts > 0;
  const greeting = isReturningPlayer
    ? "Hola, welcome back!"
    : "Hola, my name is Zorrito and we are going to practice some Spanish together";
  const actionLabel = isReturningPlayer ? "Continue" : "Start";
  setAppHtml(`
    <section class="app-view start-view">
      ${renderHeader()}
      <article class="intro-card start-card card">
        <div class="start-greeting">
          <img class="start-zorrito" src="./design/brand/zorrito-speech.png" srcset="./design/brand/zorrito-speech.png 1x, ./design/brand/zorrito-speech@2x.png 2x" alt="Zorrito" />
          <div class="speech-bubble start-bubble">
            <p class="eyebrow">Zorrito</p>
            ${renderAnimatedSpeechText(greeting)}
          </div>
        </div>
        <button class="primary-action" data-action="start">${actionLabel}</button>
      </article>
      <article class="quest-link-card card">
        <div>
          <p class="eyebrow">Test mode</p>
          <h2>Ser estar quest</h2>
          <p>Practice choosing between <strong>ser</strong> and <strong>estar</strong> from context.</p>
        </div>
        <a class="secondary-link" href="./?quest=ser-estar" data-action="show-quest-intro">Start quest</a>
      </article>
      <article class="quest-link-card card">
        <div>
          <p class="eyebrow">Test mode</p>
          <h2>Conceptos</h2>
          <p>Find the shared Spanish concept from three Spanish examples.</p>
        </div>
        <a class="secondary-link" href="./?mode=concepts" data-action="show-concept-intro">Start concepts</a>
      </article>
      <section class="status-strip">
        <div>
          <span>${attempts}</span>
          <p>recent attempts</p>
        </div>
        <div>
          <span>${verbCount}</span>
          <p>verbs loaded</p>
        </div>
      </section>
    </section>
  `);
}

function renderConceptIntro(historyMode = "push") {
  if (historyMode === "push") {
    window.history.pushState({}, "", "./?mode=concepts");
  } else if (historyMode === "replace") {
    window.history.replaceState({}, "", "./?mode=concepts");
  }

  setAppHtml(`
    <section class="app-view start-view">
      ${renderHeader("Conceptos")}
      <article class="quest-intro-card card">
        <p class="eyebrow">Modo de prueba</p>
        <h1>Conceptos</h1>
        <div class="start-greeting quest-greeting">
          <img class="start-zorrito" src="./design/brand/zorrito-speech.png" srcset="./design/brand/zorrito-speech.png 1x, ./design/brand/zorrito-speech@2x.png 2x" alt="Zorrito" />
          <div class="speech-bubble start-bubble">
            <p class="eyebrow">Zorrito explica</p>
            ${renderAnimatedSpeechText("Lee tres frases en español. Todas comparten una idea. Elige el concepto que aparece en las tres.")}
          </div>
        </div>
        <section class="concept-rule-card" aria-label="Reglas del modo conceptos">
          <p class="eyebrow">Reglas</p>
          <ul>
            <li>Tres frases completas.</li>
            <li>Cuatro opciones en español.</li>
            <li>Una idea en común.</li>
            <li>Una pista si necesitas ayuda.</li>
          </ul>
        </section>
        <button class="primary-action" data-action="start-concepts">Empezar</button>
      </article>
    </section>
  `);
}

function renderQuestIntro(historyMode = "push") {
  if (historyMode === "push") {
    window.history.pushState({}, "", "./?quest=ser-estar");
  } else if (historyMode === "replace") {
    window.history.replaceState({}, "", "./?quest=ser-estar");
  }

  setAppHtml(`
    <section class="app-view start-view">
      ${renderHeader("Quest")}
      <article class="quest-intro-card card">
        <p class="eyebrow">Quest</p>
        <h1>The Two Be's</h1>
        <div class="start-greeting quest-greeting">
          <img class="start-zorrito" src="./design/brand/zorrito-speech.png" srcset="./design/brand/zorrito-speech.png 1x, ./design/brand/zorrito-speech@2x.png 2x" alt="Zorrito" />
          <div class="speech-bubble start-bubble">
            <p class="eyebrow">Zorrito explains</p>
            ${renderAnimatedSpeechText("Think of ser as what something is, and estar as where something is or how it is right now. Use the clue to decide which one fits.")}
          </div>
        </div>
        <section class="quest-rule-grid" aria-label="Ser and estar clues">
          <article class="quest-rule-card">
            <p class="eyebrow">Ser</p>
            <h2>What something is</h2>
            <p>Use <strong>ser</strong> for things that define someone or something.</p>
            <ul>
              <li>profession</li>
              <li>nationality or origin</li>
              <li>personality or description</li>
              <li>material</li>
              <li>ownership</li>
              <li>time and event location</li>
            </ul>
          </article>
          <article class="quest-rule-card">
            <p class="eyebrow">Estar</p>
            <h2>Where or how right now</h2>
            <p>Use <strong>estar</strong> for location, condition, and things that can change.</p>
            <ul>
              <li>place or position</li>
              <li>feelings</li>
              <li>temporary states</li>
              <li>conditions</li>
              <li>actions in progress</li>
            </ul>
          </article>
        </section>
        <button class="primary-action" data-action="start-quest">Start quest</button>
      </article>
    </section>
  `);
}

function renderConceptStep() {
  const { challenge } = session;
  setAppHtml(`
    <section class="app-view">
      ${renderHeader("Conceptos")}
      <article class="hero-card card concept-card">
        <div class="hero-topline">
          <span class="tag">${escapeHtml(challenge.family)}</span>
          <span class="muted">concepto</span>
        </div>
        <p class="hero-kicker">Tres frases</p>
        <ol class="concept-examples">
          ${challenge.examples.map((example) => `<li>${escapeHtml(example)}</li>`).join("")}
        </ol>
      </article>
      <article class="quiz-card card">
        <div class="quiz-header">
          <div>
            <p class="eyebrow">Pregunta</p>
            <h2 class="quiz-title">¿Qué concepto tienen en común estas frases?</h2>
          </div>
          <div class="question-mark">?</div>
        </div>
        <div class="answer-list">
          ${session.answers.map((answer) => renderAnswerButton(answer, "concept")).join("")}
        </div>
      </article>
      ${session.hintVisible ? renderConceptHint(challenge) : ""}
    </section>
  `);
}

function renderQuestStep() {
  const { question } = session;
  setAppHtml(`
    <section class="app-view">
      ${renderHeader("Ser estar quest")}
      <article class="hero-card card">
        <div class="hero-topline">
          <span class="tag">${escapeHtml(question.kind)}</span>
          <span class="muted">ser vs estar</span>
        </div>
        <p class="hero-kicker">Clue: ${escapeHtml(question.clue ?? question.kind)}</p>
        <h1 class="reverse-prompt">${escapeHtml(question.prompt)}</h1>
      </article>
      <article class="quiz-card card">
        <div class="quiz-header">
          <div>
            <p class="eyebrow">Quest question</p>
            <h2 class="quiz-title">Which sentence fits the context?</h2>
          </div>
          <div class="question-mark">?</div>
        </div>
        <div class="answer-list">
          ${session.answers.map((answer) => renderAnswerButton(answer, "quest")).join("")}
        </div>
      </article>
    </section>
  `);
}

function renderMeaningStep() {
  const { verb } = session;
  setAppHtml(`
    <section class="app-view">
      ${renderHeader("Meaning")}
      <article class="hero-card card">
        <div class="hero-topline">
          <span class="tag">Hero</span>
          <span class="muted">${verb.region}</span>
        </div>
        <p class="hero-kicker">Infinitive</p>
        <h1 class="hero-word">${escapeHtml(verb.infinitive)}</h1>
      </article>
      <article class="quiz-card card">
        <div class="quiz-header">
          <div>
            <p class="eyebrow">Step 1</p>
            <h2 class="quiz-title">What does <span>${escapeHtml(verb.infinitive)}</span> mean?</h2>
          </div>
          <div class="question-mark">?</div>
        </div>
        <div class="answer-list">
          ${session.meaningAnswers.map((answer) => renderAnswerButton(answer, "meaning")).join("")}
        </div>
      </article>
    </section>
  `);
}

function renderFormStep() {
  const { form, verb } = session;
  const isReverse = session.mode === "reverse";
  setAppHtml(`
    <section class="app-view">
      ${renderHeader(isReverse ? "Reverse" : "Sentence")}
      <article class="hero-card card">
        <div class="hero-topline">
          <span class="tag">${isReverse ? "English" : formatTense(form.tense)}</span>
          <span class="muted">${escapeHtml(form.person)}</span>
        </div>
        <p class="hero-kicker">${isReverse ? "Choose the Spanish sentence" : escapeHtml(verb.infinitive)}</p>
        ${
          isReverse
            ? `<h1 class="reverse-prompt">${escapeHtml(form.english)}</h1>`
            : `<h1 class="form-word">${escapeHtml(form.form)}</h1>
        <p class="sentence-text">${escapeHtml(form.spanish)}</p>`
        }
      </article>
      <article class="quiz-card card">
        <div class="quiz-header">
          <div>
            <p class="eyebrow">${isReverse ? "Reverse mode" : "Step 2"}</p>
            <h2 class="quiz-title">${isReverse ? "Which Spanish sentence matches?" : "Which sentence matches?"}</h2>
          </div>
          <div class="question-mark">2</div>
        </div>
        <div class="answer-list">
          ${session.formAnswers.map((answer) => renderAnswerButton(answer, "form")).join("")}
        </div>
      </article>
    </section>
  `);
}

function renderResult() {
  const completed = session.status === "completed";
  const isQuest = session.mode === "quest";
  const isConcept = session.mode === "concept";
  const headerLabel = isConcept ? (completed ? "Bien" : "Pista") : completed ? "Success" : "Try again";
  const eyebrowLabel = isConcept ? (completed ? "Correcto" : "Intenta otra vez") : completed ? "Completed" : "Failed";
  const titleLabel = isConcept ? (completed ? "Concepto encontrado." : "Sigue pensando.") : completed ? "Nice work." : "Good practice.";
  const actionLabel = isConcept ? "Siguiente" : "Next";
  setAppHtml(`
    <section class="app-view result-view">
      ${renderHeader(headerLabel)}
      <article class="result-card card ${completed ? "is-success" : "is-failure"}">
        <p class="eyebrow">${eyebrowLabel}</p>
        <h1>${titleLabel}</h1>
        <p>${renderResultMessage(completed)}</p>
        <button class="primary-action" data-action="next">${actionLabel}</button>
      </article>
      ${isConcept ? renderConceptRecap() : isQuest ? renderQuestRecap() : renderPracticeRecap()}
    </section>
  `);
}

function renderResultMessage(completed) {
  if (session.mode === "concept") {
    return completed
      ? "Encontraste el concepto común en las tres frases."
      : "Mira la pista y prueba otra vez.";
  }
  if (session.mode === "quest") {
    return completed
      ? "You chose the sentence that fits the ser/estar context."
      : "Check the context clue and try another ser/estar question.";
  }
  return completed
    ? "You matched the meaning and sentence."
    : "This verb will come back later. Mistakes are useful.";
}

function renderPracticeRecap() {
  return `
    <article class="summary-card card">
      <p class="eyebrow">Practice recap</p>
      <p><strong>${escapeHtml(session.form.form)}</strong> &middot; ${escapeHtml(session.form.spanish)}</p>
      <p>${escapeHtml(session.form.english)}</p>
    </article>
  `;
}

function renderConceptHint(challenge) {
  return `
    <article class="speech-card card">
      <div class="speech-layout">
        <img class="zorrito-mark" src="./design/brand/zorrito-speech.png" srcset="./design/brand/zorrito-speech.png 1x, ./design/brand/zorrito-speech@2x.png 2x" alt="Zorrito" />
        <div class="speech-bubble">
          <p class="eyebrow">Zorrito</p>
          ${renderAnimatedSpeechText(challenge.hint)}
          <p class="translation-text">${escapeHtml(challenge.englishHint)}</p>
        </div>
      </div>
    </article>
  `;
}

function renderQuestRecap() {
  return `
    <article class="summary-card card">
      <p class="eyebrow">Quest recap</p>
      <p><strong>${escapeHtml(session.question.correct)}</strong></p>
      <p>${escapeHtml(session.question.explanation)}</p>
    </article>
  `;
}

function renderConceptRecap() {
  return `
    <article class="summary-card card">
      <p class="eyebrow">Concepto</p>
      <p class="concept-translation-pair">
        <strong>${escapeHtml(session.challenge.correctAnswer)}</strong>
        <span>${escapeHtml(session.challenge.englishConcept)}</span>
      </p>
      <p>${escapeHtml(session.challenge.hint)}</p>
      <p class="translation-text">${escapeHtml(session.challenge.englishHint)}</p>
    </article>
  `;
}

function renderHeader(label = "Verb") {
  return `
    <header class="app-header">
      <div class="brand-lockup">
        <img class="logo-mark" src="./design/brand/logo-mark-64.png" srcset="./design/brand/logo-mark-64.png 1x, ./design/brand/logo-mark-128.png 2x" alt="Werbos logo" />
        <div>
          <p class="eyebrow">Werbos</p>
          <p class="muted">${label}</p>
        </div>
      </div>
    </header>
  `;
}

function renderAnimatedSpeechText(message) {
  return `
    <p
      class="speech-text type-caret"
      data-speech-text
      data-speech-message="${escapeAttribute(message)}"
      aria-label="${escapeAttribute(message)}"
    ></p>
  `;
}

function renderAnswerButton(answer, step) {
  return `
    <button class="answer-button" data-answer="${escapeAttribute(answer)}" data-step="${step}">
      <span>${escapeHtml(answer)}</span>
    </button>
  `;
}

function renderLoading() {
  setAppHtml(`<section class="app-view"><article class="card intro-card"><p class="eyebrow">Werbos</p><h1>Loading...</h1></article></section>`);
}

function renderError(error) {
  setAppHtml(`
    <section class="app-view">
      <article class="card result-card is-failure">
        <p class="eyebrow">Error</p>
        <h1>Could not start practice.</h1>
        <p>${escapeHtml(error.message)}</p>
      </article>
    </section>
  `);
}

function setAppHtml(html) {
  app.innerHTML = html;
  animateSpeechText(app);
}

function animateSpeechText(root) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.querySelectorAll("[data-speech-text]").forEach((target) => {
    const message = target.dataset.speechMessage || "";
    if (reduceMotion) {
      target.textContent = message;
      target.classList.remove("type-caret");
      return;
    }

    let index = 0;
    target.textContent = "";

    function typeNext() {
      if (!target.isConnected) {
        return;
      }
      target.textContent = message.slice(0, index);
      if (index < message.length) {
        index += 1;
        window.setTimeout(typeNext, 34);
        return;
      }
      target.classList.remove("type-caret");
    }

    typeNext();
  });
}

app.addEventListener("click", (event) => {
  const button = event.target.closest("button, a");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  if (action === "start") {
    startRandomSession();
    return;
  }

  if (action === "show-quest-intro") {
    event.preventDefault();
    renderQuestIntro("push");
    return;
  }

  if (action === "show-concept-intro") {
    event.preventDefault();
    renderConceptIntro("push");
    return;
  }

  if (action === "start-quest") {
    startQuestSession();
    return;
  }

  if (action === "start-concepts") {
    startConceptSession();
    return;
  }

  if (action === "next") {
    if (session?.mode === "concept") {
      startConceptSession();
      return;
    }
    if (session?.mode === "quest") {
      startQuestSession();
      return;
    }
    startRandomSession();
    return;
  }

  const answer = button.dataset.answer;
  const step = button.dataset.step;
  if (step === "meaning") {
    session = answerMeaning(session, answer);
    if (session.status === "failed") {
      finishAttempt("failed", "failure");
      return;
    }
    playSound("success");
    renderFormStep();
    return;
  }

  if (step === "form") {
    session = answerForm(session, answer);
    finishAttempt(session.status, session.status === "completed" ? "success" : "failure");
    return;
  }

  if (step === "quest") {
    session = answerQuest(session, answer);
    finishAttempt(session.status, session.status === "completed" ? "success" : "failure");
    return;
  }

  if (step === "concept") {
    session = answerConcept(session, answer);
    if (session.status === "completed") {
      finishAttempt("completed", "success");
      return;
    }
    playSound("failure");
    renderConceptStep();
  }
});

function startRandomSession() {
  session = createVerbSession(pickRandomVerb(verbData.items));
  if (session.step === "form") {
    renderFormStep();
    return;
  }
  renderMeaningStep();
}

function startQuestSession() {
  session = createQuestSession(serEstarQuest);
  renderQuestStep();
}

function startConceptSession() {
  session = createConceptSession(conceptData);
  renderConceptStep();
}

function finishAttempt(status, soundName) {
  if (session.mode === "concept") {
    progress = recordAttempt(progress, {
      mode: session.mode,
      conceptId: session.conceptId,
      challengeId: session.challenge.id,
      misses: session.misses,
      status
    });
  } else if (session.mode === "quest") {
    progress = recordAttempt(progress, {
      mode: session.mode,
      questId: session.questId,
      questionId: session.question.id,
      status
    });
  } else {
    progress = recordAttempt(progress, {
      mode: session.mode,
      verbId: session.verb.id,
      formId: session.form.id,
      status
    });
  }
  playSound(soundName);
  renderResult();
}

function shouldStartSerEstarQuest() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const query = new URLSearchParams(window.location.search);
  return path.endsWith("/quest-ser-estar") || query.get("quest") === "ser-estar";
}

function shouldStartConcepts() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const query = new URLSearchParams(window.location.search);
  return path.endsWith("/concepts") || query.get("mode") === "concepts";
}

function playSound(name) {
  const sound = sounds[name];
  if (!sound) {
    return;
  }
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function formatTense(tense) {
  return tense.replace(/([A-Z])/g, " $1").toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
