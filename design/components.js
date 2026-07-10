const zorritoMessage = "Decir is irregular in the yo form: digo. Show one useful example before asking for recall.";
const assetBase = new URL("./", document.currentScript.src);
const logoMark = new URL("brand/logo-mark-64.png", assetBase).href;
const logoMark2x = new URL("brand/logo-mark-128.png", assetBase).href;
const favicon16 = new URL("brand/favicon-16.png", assetBase).href;
const favicon32 = new URL("brand/favicon-32.png", assetBase).href;
const appleTouchIcon = new URL("brand/apple-touch-icon.png", assetBase).href;
const pwaIcon192 = new URL("brand/pwa-icon-192.png", assetBase).href;
const pwaIcon512 = new URL("brand/pwa-icon-512.png", assetBase).href;
const zorritoSpeech = new URL("brand/zorrito-speech.png", assetBase).href;
const zorritoSpeech2x = new URL("brand/zorrito-speech@2x.png", assetBase).href;

const components = {
  brand: `
    <article class="card brand-card">
      <div class="brand-showcase">
        <div class="brand-primary">
          <img
            class="brand-logo-mark"
            src="${logoMark}"
            srcset="${logoMark} 1x, ${logoMark2x} 2x"
            alt="Werbos logo"
          />
          <div>
            <p class="eyebrow">Werbos logo</p>
            <p class="brand-copy">Primary W mark for app headers, component previews, browser favicons, iOS homescreen, and PWA install icons.</p>
          </div>
        </div>
        <div class="brand-assets">
          <div class="brand-asset brand-asset-small">
            <img src="${favicon16}" alt="Werbos 16 pixel favicon" />
            <span>16 favicon</span>
          </div>
          <div class="brand-asset brand-asset-small">
            <img src="${favicon32}" alt="Werbos 32 pixel favicon" />
            <span>32 favicon</span>
          </div>
          <div class="brand-asset">
            <img src="${appleTouchIcon}" alt="Werbos Apple touch icon" />
            <span>Apple touch icon</span>
          </div>
          <div class="brand-asset">
            <img src="${pwaIcon192}" alt="Werbos 192 pixel PWA icon" />
            <span>PWA 192</span>
          </div>
          <div class="brand-asset">
            <img src="${pwaIcon512}" alt="Werbos 512 pixel PWA icon" />
            <span>PWA 512</span>
          </div>
        </div>
      </div>
    </article>
  `,
  hero: `
    <article class="card hero-card">
      <div class="hero-topline">
        <span class="tag">Verb hero</span>
        <span class="muted">1 / 100</span>
      </div>
      <p class="hero-kicker">Spanish verb</p>
      <h1 class="hero-word">decir</h1>
      <p class="hero-meaning">to say / to tell</p>
      <div class="tense-grid">
        <div class="tense-chip"><strong>Present</strong><span>digo</span></div>
        <div class="tense-chip"><strong>Preterite</strong><span>dije</span></div>
        <div class="tense-chip"><strong>Perfect</strong><span>he dicho</span></div>
      </div>
    </article>
  `,
  description: `
    <article class="card description-card">
      <p class="eyebrow">Description</p>
      <p class="description-title">Use <strong>decir</strong> when someone says, tells, or reports something.</p>
      <p class="description-copy">Keep the copy short so the learner can return to the answer choices quickly.</p>
    </article>
  `,
  "speech-bubble": `
    <article class="card speech-card">
      <div class="speech-layout">
        <img
          class="zorrito-mark"
          src="${zorritoSpeech}"
          srcset="${zorritoSpeech} 1x, ${zorritoSpeech2x} 2x"
          alt="Zorrito"
        />
        <div class="speech-bubble">
          <p class="eyebrow">Zorrito explains</p>
          <p class="speech-text type-caret" data-speech-text></p>
        </div>
      </div>
    </article>
  `,
  quiz: `
    <article class="card quiz-card">
      <div class="quiz-header">
        <div>
          <p class="eyebrow">Quiz screen</p>
          <h2 class="quiz-title">What does <span>decir</span> mean?</h2>
        </div>
        <div class="question-mark">?</div>
      </div>
      <div class="answer-list">
        <button class="answer-button is-correct">
          <span>to say / to tell</span>
          <span class="answer-status" aria-label="Correct answer">OK</span>
        </button>
        <button class="answer-button"><span>to hear</span><span class="answer-key">A</span></button>
        <button class="answer-button"><span>to feel</span><span class="answer-key">B</span></button>
        <button class="answer-button"><span>to think</span><span class="answer-key">C</span></button>
      </div>
      <footer class="feedback-card">
        <p class="eyebrow">Feedback pattern</p>
        <p>Correct answers turn solid green. Distractors stay quiet so feedback feels clear without becoming noisy.</p>
      </footer>
    </article>
  `
};

function mountComponents(root = document) {
  root.querySelectorAll("[data-component]").forEach((target) => {
    const name = target.getAttribute("data-component");
    target.innerHTML = components[name] || "";
  });
  startSpeech(root);
}

function startSpeech(root = document) {
  root.querySelectorAll("[data-speech-text]").forEach((target) => {
    let index = 0;

    function typeNext() {
      target.textContent = zorritoMessage.slice(0, index);
      index = index < zorritoMessage.length ? index + 1 : 0;
      setTimeout(typeNext, index === 0 ? 1100 : 34);
    }

    typeNext();
  });
}

mountComponents();
