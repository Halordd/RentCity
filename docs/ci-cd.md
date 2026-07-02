# RentCity CI/CD

RentCity uses GitHub Actions as the required quality gate before code is merged or released.

## Required Status Check

Use this single required status check in GitHub branch protection:

```text
Release readiness
```

That final job fails unless every production gate below succeeds.

## Gates

- `Frontend quality gate`: installs `front-end`, then runs typecheck, lint, and production build.
- `Backend quality gate`: starts PostgreSQL and Redis, validates Prisma, applies migrations, builds, runs unit tests, and runs audit.
- `API contract check`: runs inside the backend gate and fails if `docs/api/openapi.json` is not generated from the current NestJS controllers and DTOs.
- `Production security gate`: starts the backend with `NODE_ENV=production` and verifies security headers, CORS allowlist behavior, disabled OpenAPI docs, hidden OTP dev codes, and signed payment webhooks.
- `Full-stack E2E`: starts real backend services and runs the Playwright flows for web, app, web_app, owner, admin, backend contract, and permissions.
- `Production Docker package`: validates `docker-compose.production.yml`, builds `migrate`, `frontend`, and `backend`, starts the production Compose stack, verifies backend readiness, frontend health, and `GET /listings`, then tears the stack down.

## Push Triggers

Push CI is intentionally limited to:

```text
main
develop
```

Developer branches, release branches, `stagging`, and tags are not push triggers. This keeps one release commit from creating duplicate CI runs across several refs. Pull requests into `main` or `develop` and manual `workflow_dispatch` still run the same workflow.

## Branch Protection Setup

Protect these branches:

```text
main
develop
stagging
release/*
```

Recommended GitHub settings:

- Require a pull request before merging.
- Require status checks to pass before merging.
- Require the `Release readiness` status check.
- Require branches to be up to date before merging.
- Block force pushes.
- Block branch deletion.

## Release Flow

1. Merge completed work into `develop`.
2. Create a `release/vX.Y.Z` branch from `develop`.
3. Push the release commit to `develop` and let `Release readiness` pass.
4. Fast-forward `stagging` from the verified release commit.
5. Tag the release as `vX.Y.Z`.
6. Keep only the newest active `release/vX.Y.Z` branch; older release tags remain as immutable history.
7. Promote to `main` only after staging validation.
