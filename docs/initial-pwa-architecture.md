# Initial PWA Architecture

## Application Shape

Werbos should start as a static web application:

- `index.html` for the app shell.
- `src/` or `assets/` for JavaScript, CSS, images, and icons.
- `data/` for downloadable JSON exercise resources.
- `manifest.webmanifest` for PWA metadata.
- `service-worker.js` for offline caching.

The frontend should be written in vanilla HTML, CSS, and JavaScript. JavaScript can be organized as ES modules.

## Exercise Data

Exercise data should live in JSON files served with the static site. A first structure could be:

```text
data/
  verbs.v1.json
  exercises.v1.json
```

Recommended resource characteristics:

- Include a `version` field.
- Include stable IDs for verbs, tenses, prompts, and exercise items.
- Keep display text separate from answer-checking metadata.
- Avoid storing user progress inside the exercise files.
- Keep exercise-family rules documented in `docs/exercise-framework.md`.
- Keep family-specific notes in docs such as `docs/verb-practice-architecture.md`, `docs/quest-architecture.md`, `docs/concept-challenge-architecture.md`, and `docs/pop-quiz-architecture.md`.

Example direction:

```json
{
  "version": 1,
  "language": "es",
  "items": [
    {
      "id": "ser",
      "rank": 1,
      "infinitive": "ser",
      "english": "to be"
    }
  ]
}
```

## Local Progress

Progress is device specific and should be saved in browser storage.

For the first version, `localStorage` is acceptable if progress is limited to compact values such as completed exercise IDs, streak counters, last practiced timestamps, and per-verb confidence scores.

Use `IndexedDB` if progress becomes larger, more query-heavy, or needs structured history.

Progress data should be:

- Namespaced, for example `werbos.progress.v1`.
- Versioned.
- Recoverable when possible if a stored value is malformed.
- Independent from downloadable exercise JSON.

## Offline Behavior

The PWA should cache:

- The app shell.
- CSS and JavaScript assets.
- PWA manifest and icons.
- Current exercise JSON files.

The first service worker can use a simple cache-first strategy for versioned static assets and exercise data. When exercise data updates, the cache version should change.

## GitHub Pages Deployment

The app should deploy as a static site to GitHub Pages.

Implementation details to remember:

- Avoid server-side routing assumptions.
- Use relative asset paths where practical.
- Ensure the service worker scope works under a project path such as `/werbos/`.
- Do not rely on environment secrets.
- Keep build output deterministic and committed or generated through GitHub Actions.

## Suggested Initial File Layout

```text
.
  index.html
  manifest.webmanifest
  service-worker.js
  data/
    verbs.v1.json
    concepts.v1.json
    quests/
    pop-quizzes/
  src/
    app.js
    data-loader.js
    progress-store.js
    practice-engine.js
    styles.css
  docs/
    constitution.md
    initial-pwa-architecture.md
    tailwind-css-decision.md
```

If Tailwind CSS is compiled locally, generated CSS can live under `assets/` or `dist/`, depending on the build setup.
