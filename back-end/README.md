# RentCity Backend

Backend scaffold for the RentCity rental platform. This backend is organized as a modular NestJS application, where each business area has its own module, controller, and service.

## Stack

- Framework: NestJS 11
- Runtime: Node.js
- HTTP adapter: Fastify
- Language: TypeScript strict mode
- ORM: Prisma
- Database: PostgreSQL
- Cache/queue candidate: Redis
- API style: REST
- Auth direction: OTP login + JWT/session boundary
- Validation: Nest validation pipe with `class-validator` ready
- Security baseline: CORS + Fastify Helmet
- Dev infra: Docker Compose for PostgreSQL and Redis
- Deployment: Dockerfile, Prisma migrations, env validation

## Backend Architecture

RentCity backend is currently a modular monolith. That means it is one deployable backend application, but internally it is split by business capability:

- `controller`: receives HTTP requests and maps routes.
- `service`: owns business logic for that module.
- `database`: Prisma access layer.
- `prisma/schema.prisma`: source of truth for relational data models.
- `docs/`: API, architecture, and service handoff notes.

This shape is intentional. It keeps the project simple for MVP while still making it easy to split into separate services later if traffic or team size grows.

## Folder Structure

```text
back-end/
  prisma/schema.prisma
  src/
    main.ts
    app.module.ts
    common/
    config/
    database/
    modules/
      admin/
      auth/
      bookings/
      contracts/
      health/
      listings/
      messages/
      notifications/
      owner/
      payments/
      saved/
      users/
```

## Setup

```bash
cd back-end
cmd /c npm install
cmd /c npm run db:up
cmd /c npm run prisma:generate
cmd /c npm run prisma:migrate
cmd /c npm run seed
cmd /c npm run dev
```

Database tools:

```bash
cmd /c npm run db:up
cmd /c npm run prisma:validate
cmd /c npm run prisma:migrate
cmd /c npm run prisma:deploy
cmd /c npm run db:down
```

## Environment

Copy `.env.example` to `.env`.

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rentcity?schema=public"
NODE_ENV="development"
JWT_SECRET="change-me"
PORT=4000
FRONTEND_ORIGINS="http://localhost:4173,http://localhost:4174"
```

Production deployment notes are in `docs/deployment.md`.

## MVP Modules

- Auth: OTP request/verify, logout, current user.
- Users: tenant, owner, admin role boundaries.
- Listings: search, detail, owner CRUD, image placeholder, admin review.
- Bookings: availability, create, reschedule, cancel, owner confirm.
- Saved homes: save, unsave, list saved homes.
- Messages: conversations and basic message creation.
- Payments: deposit request, payment lookup, webhook placeholder.
- Contracts: draft contract creation and lookup.
- Owner: portfolio, booking queue, listing management.
- Admin: metrics, verification review, disputes, audit logs, access boundary.
- Notifications/PWA: push subscription and app-state endpoints.

## API Docs

See:

```text
docs/api.md
docs/architecture.md
docs/services.md
```

## Frontend Integration

The frontend should point `VITE_API_BASE_URL` to this backend, for example:

```text
VITE_API_BASE_URL=http://localhost:4000
```

API responses should keep stable fields:

- `id`
- `status`
- `createdAt`
- `updatedAt`
- ISO date strings
- image URLs, not raw file bytes

## Notes

This backend now has a production-ready service foundation: guarded routes, DTO validation, Prisma data access, env validation, Docker build, migration path, and seed data. Real external adapters are still needed for SMS OTP delivery, file storage, payment verification, push notifications, and observability before handling real transactions.
