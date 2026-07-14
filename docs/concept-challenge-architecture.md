# Concept Challenge Architecture

## Purpose

The concept challenge teaches small Spanish concepts through Spanish context only. A learner sees three Spanish sentences that share one idea, then chooses the shared concept from four Spanish options.

This mode is a glossary mechanic, not a translation exercise. It should help the learner infer meaning from repeated context.

## Interaction

Each challenge shows:

- exactly three complete Spanish example sentences
- one Spanish question: `¿Qué concepto tienen en común estas frases?`
- exactly four Spanish answer choices
- one clearly correct concept
- a short Zorrito hint in Spanish after an incorrect answer

The learner taps an answer. A correct answer plays the success sound and records the concept attempt. An incorrect answer plays the failure sound, keeps the same card visible, and reveals the hint so the learner can try again.

## Content Model

Concept content lives in `data/concepts.v1.json`.

Each item has:

- `id`: stable challenge id
- `concept`: the target Spanish concept
- `family`: concept family used for meaningful distractors
- `examples`: exactly three Spanish sentences
- `choices`: exactly four Spanish concepts
- `correctAnswer`: the concept that all examples share
- `englishConcept`: English reinforcement for the concept
- `hint`: one short Spanish clue from Zorrito
- `englishHint`: English reinforcement for the clue or explanation

Distractors should come from the same family as the correct answer. For example, a position concept should be tested against other position concepts, not against time or quantity concepts.

The challenge card stays Spanish-first: examples, prompt, and answer choices are in Spanish. After feedback, Werbos may show the Spanish concept and clue with English translations underneath to reinforce meaning.

## Initial Families

The first version supports these families:

- `posicion`: `encima de`, `debajo de`, `delante de`, `detrás de`, `dentro de`, `fuera de`, `entre`, `cerca de`, `lejos de`
- `tiempo`: `antes`, `después`, `durante`, `mientras`, `todavía`, `ya`
- `cantidad`: `mucho`, `poco`, `demasiado`, `suficiente`, `casi`
- `direccion`: `hacia`, `desde`, `hasta`, `por`, `alrededor de`
- `conexion`: `porque`, `aunque`, `además`, `entonces`, `pero`

## Progress Direction

A concept should eventually be learned through several differently worded challenge sets. For example, `encima de` can appear in physical object examples, people and places, less literal usage, and mixed review against nearby position concepts.

The first implementation records completed concept challenge attempts in local progress. A later game engine can promote a concept to learned only after several distinct challenge ids for that concept are answered correctly.

## Validation

Run `node scripts/verify-concept-data.mjs` after editing concept content. The verifier protects the mechanical rules: stable ids, known families, exactly three examples, exactly four choices, correct answer in choices, same-family distractors, and complete-sentence hints.
