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
- `components/quiz.html` - standalone quiz screen preview.
- `brand/zorrito-speech.png` - speech-bubble-sized Zorrito avatar.
- `brand/zorrito-speech@2x.png` - high-density source for the same avatar.

## Scope

The artifact covers:

- Logo and favicon assets for app and device usage.
- Hero verb presentation.
- Short descriptive copy.
- Zorrito speech bubble with animated text.
- Zorrito speech-bubble avatar image.
- Multiple-choice quiz screen with three to four answers.
- Real logo and icon treatments.

## Logo Assets

- `brand/favicon.ico` - multi-size browser favicon.
- `brand/favicon-16.png` and `brand/favicon-32.png` - explicit browser favicon PNGs.
- `brand/apple-touch-icon.png` - iOS homescreen icon.
- `brand/pwa-icon-192.png` and `brand/pwa-icon-512.png` - PWA install icons.
- `brand/logo-mark-64.png` and `brand/logo-mark-128.png` - app header logo mark.

Open `index.html` for the full gallery, or open any file under `components/`
to preview one component in isolation.
