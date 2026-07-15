# Quest Architecture

## Purpose

Quests are structured grammar chapters. They teach bounded ideas that need a short mental model before normal practice, such as `ser` vs `estar` or the near past.

Quests are one exercise family in the broader framework described in `docs/exercise-framework.md`.

## Interaction

A quest should start with an intro screen. The first intro explains the grammar idea carefully. A returning intro should be shorter and remind the player what kind of question is coming.

Quest questions can then appear inside mixed gameplay. They should feel like focused chapter questions, not random isolated facts.

Current quest examples:

- `data/quests/ser-estar.v1.json`
- `data/quests/near-past.v1.json`

## Content Model

Quest files live in `data/quests/`.

Each quest has:

- `version`: data version
- `id`: stable quest id
- `title`: display title
- `description`: short purpose
- `items`: quest questions

Quest question shapes can vary by quest, but every question should have:

- stable id
- prompt or phrase
- correct answer
- distractors or choices
- explanation
- kind or category when useful for progress and review

## Progress Direction

Progress should be recorded at quest and question level.

Important progress keys:

- quest id
- question id
- question kind
- last result
- last practiced timestamp
- next due timestamp
- quest-level completion state

## Validation

Each quest should have a focused verifier. Current verifiers:

- `node scripts/verify-ser-estar-quest.mjs`
- `node scripts/verify-near-past-quest.mjs`
