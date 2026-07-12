# Werbos Design System Proposal

This folder is the Calm Study design-system artifact for the Werbos practice UI.
It uses Tailwind CSS through the CDN for rapid iteration. The production app
should later move these decisions into the compiled Tailwind build described in
`docs/tailwind-css-decision.md`.

## Contents

- `index.html` - main design-system gallery with each component shown separately.
- `styles.css` - shared Calm Study tokens and component classes.
- `brand/` - logo, favicon, Apple touch icon, PWA icon, and Zorrito avatar assets.
- `components/brand.html` - standalone logo and favicon preview.
- `components/hero.html` - standalone hero word preview.
- `components/description.html` - standalone short description preview.
- `components/speech-bubble.html` - standalone Zorrito speech bubble preview.
- `components/sounds.html` - standalone sound asset preview.
- `components/quiz.html` - standalone quiz screen preview.
- `sounds/werbos-success.wav` - correct-answer success sound.
- `sounds/werbos-failure.wav` - subtle missed-answer sound.
- `sounds/werbos-lesson-complete.wav` - lesson completion sound.
- `brand/zorrito-speech.png` - speech-bubble-sized Zorrito avatar.
- `brand/zorrito-speech@2x.png` - high-density source for the same avatar.

## Scope

The artifact covers:

- Logo and favicon assets for app and device usage.
- Hero verb presentation.
- Short descriptive copy.
- Zorrito speech bubble with animated text.
- Zorrito speech-bubble avatar image.
- Success, failure, and lesson-complete sounds.
- Multiple-choice quiz screen with three to four answers.
- Real logo and icon treatments.

## Logo Assets

- `brand/favicon.ico` - transparent multi-size browser favicon.
- `brand/favicon-16.png` and `brand/favicon-32.png` - transparent browser favicon PNGs.
- `brand/apple-touch-icon.png` - transparent iOS homescreen icon source.
- `brand/pwa-icon-192.png` and `brand/pwa-icon-512.png` - transparent PWA install icon sources.
- `brand/logo-mark-64.png` and `brand/logo-mark-128.png` - transparent app header logo mark.

Open `index.html` for the full gallery, or open any file under `components/`
to preview one component in isolation.
