# Technical Audit

## Starting point

- Branch/default branch: `main` / `main`.
- Starting commit: `c7c0d71`.
- Initial product: a Manifest V3 content script that sorted recognised appointment choices; no backend, database, OAuth, public booking page, conflict-safe event mutation, reschedule/cancel flow, deployment, or CI existed.
- Misleading artifacts removed: speculative DOM analysis, completed-task checklist, broken icon generators, and performance reports/benchmarks that described code and guarantees not present in the product.

## Implemented architecture

- Node.js 24 built-in HTTP server and `node:sqlite` persistence.
- Versioned SQL migrations in `migrations/`.
- React 19 + Vite operator and requester interfaces.
- Direct official Google OAuth 2.0 and Calendar REST API adapter in `src/google-provider.js`.
- Deterministic Temporal-based policy engine for timezone/DST-correct slot generation.
- Local operator bearer token; single-owner boundary enforced in every admin query.
- Public schedule slug plus separate high-entropy manage token for booking access.
- Existing Chrome content sorter preserved and still independently tested.

## Dependency and supply-chain audit

Runtime dependencies are intentionally small: React, React DOM, dotenv, and the TC39 Temporal polyfill. Vite, the React Vite plugin, and jsdom are development-only. `npm audit --audit-level=high` is a CI gate. SQLite is currently provided by Node's built-in `node:sqlite`; Node still emits an experimental API warning, which is tracked as technical debt.

## Data and ownership

One configured owner is created at startup. Schedules and OAuth connections reference that owner. Bookings reference a schedule. Admin list/update queries include the owner boundary. Public reads expose only schedule presentation fields; booking reads require a hashed manage-token match.

## Deployment truth

The application is deployable with Docker and has health/readiness endpoints, but it is not verified against a real Google account in this run. Production readiness remains partial until OAuth consent, API quota, HTTPS/reverse proxy, backup restore, and a real critical-path booking are validated by the operator.
