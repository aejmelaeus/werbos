# Werbos Constitution

## Purpose

Werbos exists to help learners practice the 100 most common Spanish verbs through focused, repeatable exercises that work quickly on everyday devices.

The first version should be small, durable, and easy to deploy. It should favor clear learning loops over platform complexity.

## Product Principles

### 1. Practice First

The application opens directly into the learning experience. Navigation, onboarding, and explanations should stay lightweight so the user can start practicing quickly.

### 2. No Accounts

Werbos has no login, user accounts, remote profiles, or cloud synchronization in the first version. Progress is device specific.

### 3. Local Progress

Progress is stored on the user's device. The app may use browser storage such as `localStorage` or `IndexedDB`, depending on the shape and volume of saved practice history.

The product must be honest about this constraint: clearing browser data or changing devices can remove progress.

### 4. Downloadable Exercise Data

Exercise content is stored in static JSON files that the app can download, cache, and use offline. Data files are part of the public application bundle and should be versioned with the code.

### 5. Static Deployment

The initial application is a static PWA deployed to GitHub Pages. It must not require a backend server, database, or build-time secret.

### 6. Vanilla Web Foundation

The frontend should use plain HTML, CSS, and JavaScript. Frameworks are avoided for the first version unless a specific need justifies them.

Small build tools are acceptable when they materially improve maintainability, for example compiling Tailwind CSS.

### 7. Offline-Capable by Design

Werbos should remain usable after the first successful load. The service worker should cache the app shell and exercise data needed for normal practice.

### 8. Learner-Friendly Feedback

Exercises should give clear feedback, reinforce correct answers, and make mistakes useful. The interface should feel calm, direct, and supportive rather than gamified to the point of distraction.

## Engineering Principles

### 1. Keep the First Version Small

Prefer simple browser APIs and static files. Avoid adding infrastructure until the product needs it.

### 2. Separate Content from Logic

Verb and exercise data belong in JSON resources. Rendering, scoring, and progress tracking belong in JavaScript modules.

### 3. Make Data Evolvable

Exercise JSON files should include a schema version or equivalent metadata. Changes to data shape should be deliberate and documented.

### 4. Protect User Progress

Progress storage should be namespaced and versioned. Migrations should be considered before changing saved data structures.

### 5. Design for GitHub Pages

Routing, asset paths, service worker scope, and cache paths must work when hosted under a GitHub Pages project path, not only at a domain root.

### 6. Test the Core Loop

The practice flow, answer checking, progress saving, and resource loading are the most important behaviors to protect with tests or manual verification.

## Non-Goals for the First Version

- User accounts.
- Cloud synchronization.
- Server-rendered pages.
- A custom backend API.
- Payments or subscriptions.
- Social features.
- Native mobile apps.
- A large frontend framework.

## Decision Rule

When a product or technical decision is unclear, choose the option that keeps Werbos easier to understand, easier to host statically, and better focused on daily Spanish verb practice.
