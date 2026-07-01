# Changelog

## v0.2.4 - 2026-07-01

### Added

- OpenAPI contract generation and drift check scripts for the NestJS backend.
- Generated API contract artifact at `docs/api/openapi.json`.
- Human-readable API contract documentation covering auth, listings, bookings, messages, payments, contracts, owner, admin, notifications, and profile routes.
- Swagger metadata for backend controllers and DTOs so request payload schemas are visible to frontend and backend contributors.
- CI API contract check inside the backend quality gate.

## v0.2.3 - 2026-07-01

### Added

- Production security E2E coverage for HTTP security headers, CORS allowlist behavior, disabled OpenAPI docs, production OTP responses, and payment webhook signatures.
- GitHub Actions production gates for security checks, Docker Compose validation/build, and a single release readiness status check.
- CI/CD documentation describing required checks and branch protection setup.

## v0.2.2 - 2026-07-01

### Added

- Backend security E2E coverage for unauthenticated protected routes, malformed bearer tokens, tenant/owner/admin role boundaries, booking ownership, and conversation ownership.
- E2E documentation entry for security and permission coverage.

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
