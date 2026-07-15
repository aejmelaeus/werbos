# Exercise Framework

## Purpose

Werbos is growing from separate practice modes into a shared exercise framework. The app currently has four exercise families:

- `verbs`: verb meaning and sentence-form practice from `data/verbs.v1.json`
- `concepts`: concept inference from three Spanish examples in `data/concepts.v1.json`
- `quests`: structured grammar chapters in `data/quests/`
- `popQuizzes`: short explicit-recall chapters in `data/pop-quizzes/`

These families should remain static-data driven. The game engine should decide what to show next, but the exercise data should stay separate from player progress and rendering logic.

## Exercise Families

### Verbs

Verb practice is the core loop for common Spanish verbs. A session currently asks for the English meaning first, then asks the learner to match a Spanish or English sentence form.

Progress should eventually track:

- verb id
- form id
- tense
- direction, such as meaning, Spanish-to-English, or English-to-Spanish
- last result
- last practiced timestamp
- next due timestamp
- strength or streak for spaced review

### Concepts

Concept challenges teach small Spanish concepts through repeated context. The learner sees three Spanish sentences and chooses the concept shared by all three.

Concepts are currently the largest content pool and should therefore appear most often in mixed gameplay. A concept should not be treated as finished after one success. Different challenge ids for the same concept should return over time so the learner sees varied examples.

Progress should eventually track:

- concept id
- challenge id
- family
- misses in the attempt
- last result
- last practiced timestamp
- next due timestamp
- strength or streak per concept

### Quests

Quests are structured grammar chapters. They teach a bounded idea, such as `ser` vs `estar` or the near past, with questions that share one learning goal.

Quest questions can be mixed into gameplay, but the first encounter with a quest should introduce the rule or mental model before individual questions appear. A returning player should get a shorter reminder screen so the module still has context without slowing down the session.

Progress should eventually track:

- quest id
- question id
- question kind
- last result
- last practiced timestamp
- next due timestamp
- quest-level completion state

### Pop Quizzes

Pop quizzes are high-repetition explicit-recall chapters. The first pop quiz trains `a`, `de`, `en`, `por`, and `y` in both directions.

Pop quizzes should appear occasionally inside mixed gameplay. They should feel like a short check-in rather than the main mode. A pop quiz attempt should end on the first miss or complete when every item is answered correctly in one streak.

Progress should eventually track:

- quiz id
- item id
- direction
- correct count
- total count
- last result
- last attempted timestamp
- next due timestamp
- chapter completion state

## Game Engine Direction

The future game engine should select the next exercise from all due items across the exercise families. The selection should be weighted by the amount of available content while still reserving space for smaller chapter types.

Initial weighting can be content-count based:

- concepts: highest weight because there are many concept challenges
- verbs: high weight because verbs are the app's foundation
- quests: medium-low weight because they are structured chapters
- pop quizzes: low weight because they are short explicit checks

The exact ratio should be computed from available due items, then bounded so no family disappears. For example, pop quizzes can have a small minimum chance when due, while concepts can dominate when many concept items are due.

## Reinforcement

Correct answers should not remove an item forever. A correct item should become less urgent, then return after a delay. A missed item should return sooner.

A simple first version can use:

- first correct: due again after a short delay
- repeated correct: due later
- miss: due soon
- repeated miss: keep in the near queue and show support content

The engine does not need a complex spaced-repetition algorithm at first. It does need stable item ids, local progress, and a deterministic way to decide whether an item is due.

## Intro States

Each exercise family should support two intro states:

- first introduction: used the first time a player enters the module
- returning reminder: used when the player has seen the module before

The first introduction should explain the mental model and rules. The returning reminder should be shorter and should tell the player what kind of task is about to appear.

This means progress needs module-level flags such as:

- `seen.verbs`
- `seen.concepts`
- `seen.quest.ser-estar`
- `seen.quest.near-past`
- `seen.popQuiz.small-words`

These flags are local progress data, not exercise content.

## Validation Direction

Every exercise family should keep a focused verifier:

- `scripts/verify-verb-data.mjs`
- `scripts/verify-concept-data.mjs`
- `scripts/verify-ser-estar-quest.mjs`
- `scripts/verify-near-past-quest.mjs`
- `scripts/verify-pop-quiz-data.mjs`

When a new exercise family or data shape is added, add a verifier before relying on the data in gameplay.
