# Werbos Design System Proposal

This folder is the Calm Study design-system artifact for the Werbos practice UI.
It uses Tailwind CSS through the CDN for rapid iteration. The production app
should later move these decisions into the compiled Tailwind build described in
`docs/tailwind-css-decision.md`.

## Contents

- `index.html` - main design-system gallery with each component shown separately.
- `styles.css` - shared Calm Study tokens and component classes.
- `components/hero.html` - standalone hero word preview.
- `components/description.html` - standalone short description preview.
- `components/speech-bubble.html` - standalone Zorrito speech bubble preview.
- `components/quiz.html` - standalone quiz screen preview.
- `brand/zorrito-speech.png` - speech-bubble-sized Zorrito avatar.
- `brand/zorrito-speech@2x.png` - high-density source for the same avatar.

## Scope

The artifact covers:

- Hero verb presentation.
- Short descriptive copy.
- Zorrito speech bubble with animated text.
- Zorrito speech-bubble avatar image.
- Multiple-choice quiz screen with three to four answers.
- Placeholder logo and icon treatments.

Open `index.html` for the full gallery, or open any file under `components/`
to preview one component in isolation.
