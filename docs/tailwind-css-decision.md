# Tailwind CSS Decision

## Recommendation

Use Tailwind CSS for Werbos, but use it conservatively.

The best fit for the first version is a small Tailwind build step that compiles only the classes used by the static HTML and JavaScript. Avoid the browser CDN build for production because it is larger, less controlled, and less appropriate for a polished PWA.

## Why Tailwind Fits

Tailwind is useful for Werbos because:

- It can produce a clean, consistent interface quickly.
- It avoids inventing a one-off design system before the product shape is known.
- It keeps styling close to simple vanilla HTML and JavaScript.
- Its compiled output can be very small when configured properly.
- It works well for static GitHub Pages deployment.

## Risks

Tailwind can become noisy if every element carries long utility lists. Werbos should avoid that by extracting repeated interface patterns into small component helpers or ordinary CSS classes when repetition becomes obvious.

Tailwind also introduces a build step. That is acceptable, but the build should stay simple and documented.

## Alternative: Hand-Written CSS

Hand-written CSS is viable for this app. It has fewer tools and can be excellent for a small project.

Choose hand-written CSS if the main priority is having zero build process. The tradeoff is that spacing, colors, responsive states, and interactive states require more design discipline from the start.

## Decision

Start with Tailwind CSS using a minimal compile step.

Use custom CSS only for:

- App-specific layout primitives.
- Repeated components that become hard to read as utility classes.
- PWA or browser behavior that utilities do not express well.

This gives Werbos a solid visual baseline without committing the project to a large frontend framework.
