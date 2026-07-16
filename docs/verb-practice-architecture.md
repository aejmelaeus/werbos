# Verb Practice Architecture

## Purpose

Verb practice is the foundation of Werbos. It trains the 100 most common Spanish verbs through meaning recognition and sentence-form practice.

Verb practice is one exercise family in the broader framework described in `docs/exercise-framework.md`.

## Interaction

A verb session currently has two steps:

- meaning: choose the English meaning of a Spanish infinitive
- form: choose the sentence or translation that matches a conjugated form

The form step can run in two directions:

- Spanish prompt to English sentence
- English prompt to Spanish sentence

The mode is randomized so regular and reversed practice are mixed.

## Content Model

Verb content lives in `data/verbs.v1.json`.

Each verb has:

- `id`: stable verb id
- `rank`: frequency rank
- `infinitive`: Spanish infinitive
- `region`: language/region marker
- `meaning`: correct English meaning and distractors
- `tenses`: grouped forms by tense

Each form has:

- `id`: stable form id
- `person`: grammatical person
- `form`: conjugated Spanish form
- `spanish`: complete Spanish sentence
- `english`: English sentence meaning

## Progress Direction

Progress should be recorded at verb and form level. A future game engine can use this to bring back weak forms sooner and strong forms later.

Important progress keys:

- verb id
- form id
- tense
- direction
- last result
- last practiced timestamp
- next due timestamp

## Validation

Run `node scripts/verify-verb-data.mjs` after editing verb content.
