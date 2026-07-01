# Changelog

## v0.2.1 - 2026-07-01

### Added

- Production Docker Compose package for frontend, backend, PostgreSQL, Redis, upload volume, and health checks.
- Root `.env.production.example` for deployment configuration.
- Frontend Docker image with Nginx static hosting and SPA route fallback.
- Production deployment guide with build, migration, startup, verification, rollback, and operations checklist.

## v0.2.0 - 2026-07-01

RentCity `v0.2.0` is the first integrated full-stack release candidate.

### Added

- Integrated `front-end`, `back-end`, and root Playwright E2E workspace into one release branch.
- React/Vite frontend for Web, App, Web app/PWA, owner flows, and admin console.
- NestJS backend with modular services for auth, listings, bookings, saved homes, messages, payments, contracts, owner dashboard, admin, notifications, and health checks.
- Prisma PostgreSQL schema, migrations, seed data, and local uploaded listing images.
- GitHub Actions workflow for frontend, backend, and full-stack E2E quality gates.
- Playwright E2E tests for web tenant, mobile app, web app/PWA, owner, admin, and backend contract smoke flows.
- Local development guide and frontend/backend environment examples.

### Verified

- Frontend production build, lint, and typecheck.
- Backend production build, lint, typecheck, unit tests, Prisma validation, and audit.
- Fresh database migration and seed.
- Full-stack Playwright E2E suite.
