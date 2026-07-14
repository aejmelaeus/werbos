# Pop Quiz Architecture

## Purpose

Pop quizzes are short, high-pressure review chapters. They differ from normal practice because the learner must answer every item correctly in one streak to complete the chapter.

The first pop quiz is `Palabras pequeñas`, focused on high-frequency Spanish connector words such as `a`, `de`, `en`, `con`, `sin`, `por`, `y`, `e`, `o`, `u`, and `ni`.

## Interaction

Each pop quiz starts with Zorrito introducing why the category matters. The learner then sees one fill-in-the-blank sentence at a time with exactly two answer buttons:

- one correct small word
- one plausible wrong small word

Correct answers advance immediately to the next item and play the success sound. A wrong answer ends the quiz, shows the correct word with a short explanation, plays the failure sound, and gives kind feedback from Zorrito.

Completing every item in one streak completes the chapter and shows an encouraging completion message.

## Content Model

Pop quiz content lives in static JSON under `data/pop-quizzes/`.

Each item has:

- `id`: stable question id
- `word`: the target small Spanish word
- `english`: short English reinforcement
- `prompt`: Spanish sentence with `___` as the blank
- `translation`: English sentence meaning
- `correctAnswer`: the answer button that completes the prompt
- `distractor`: the second answer button
- `explanation`: short explanation shown after a miss

The first implementation records one attempt when a pop quiz ends. Later game-engine work can use `correctCount`, `totalCount`, and `status` to decide when a chapter is unlocked or mastered.

## Validation

Run `node scripts/verify-pop-quiz-data.mjs` after editing pop quiz content. The verifier checks required metadata, the requested small words, two-choice answer shape, complete sentences, and unique ids.
