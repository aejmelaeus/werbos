# AGENTS.md

Guidance for future coding agents working on Werbos.

## Project Direction

Read the foundation docs before making product or architecture changes:

- `docs/constitution.md`
- `docs/initial-pwa-architecture.md`
- `docs/tailwind-css-decision.md`

Werbos is a vanilla HTML, CSS, and JavaScript PWA for practicing the 100 most common Spanish verbs. Exercise data should be static downloadable JSON. Progress should be stored locally on the user's device. The first deployment target is GitHub Pages.

## Working Rules

- Keep the first version static and backend-free.
- Do not add login, accounts, or cloud sync unless the product direction changes.
- Keep exercise content in JSON resources, separate from app logic.
- Keep local progress namespaced and versioned.
- Check that asset paths and service worker behavior work on GitHub Pages project hosting.
- Prefer small, understandable modules over framework-level structure.
- Use Tailwind CSS conservatively through a compiled build, not the CDN build, for production.
