# RentCity Backend

Backend for the RentCity rental platform. This service is organized as a modular NestJS application, where each business area has its own module, controller, DTOs, and service.

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
- Operations: request ids, consistent error payloads, liveness/readiness checks
- API contract: OpenAPI at `/api-docs` and `/api-docs.json`
- Rate limiting: Redis-backed OTP request limits when `REDIS_URL` is configured
- Storage: local upload intent provider for development and S3-compatible presigned PUT uploads for production

## Backend Architecture

RentCity backend is currently a modular monolith. That means it is one deployable backend application, but internally it is split by business capability:

- `controller`: receives HTTP requests and maps routes.
- `service`: owns business logic for that module.
- `integrations`: owns external provider boundaries such as SMS, payment, storage, and rate limiting.
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
    integrations/
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

Quality gate:

```bash
cmd /c npm run ci
```

Every response includes an `x-request-id` header. Error responses use a stable shape:

```json
{
  "error": {
    "statusCode": 400,
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "timestamp": "2026-06-23T00:00:00.000Z",
    "path": "/example",
    "requestId": "..."
  }
}
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
REFRESH_TOKEN_TTL_DAYS=30
PORT=4000
FRONTEND_ORIGINS="http://localhost:4173,http://localhost:4174"
API_DOCS_ENABLED=true
SMS_PROVIDER="local"
PAYMENT_PROVIDER="local"
STORAGE_PROVIDER="local"
REDIS_URL="redis://localhost:6379"
```

For production object storage, set:

```text
STORAGE_PROVIDER="s3"
S3_BUCKET="rentcity-uploads"
S3_REGION="ap-southeast-1"
S3_ENDPOINT=""
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_PUBLIC_BASE_URL="https://cdn.rentcity.vn/uploads"
S3_FORCE_PATH_STYLE=false
S3_UPLOAD_EXPIRES_SECONDS=600
```

`S3_ENDPOINT` and `S3_FORCE_PATH_STYLE=true` support S3-compatible providers such as MinIO, Cloudflare R2, or other object storage services.

Production deployment notes are in `docs/deployment.md`.

## MVP Modules

- Auth: OTP request/verify, refresh session, logout, current user.
- Users: tenant, owner, admin role boundaries.
- Listings: search, detail, owner CRUD, image metadata, admin review.
- Bookings: availability, create, reschedule, cancel, owner confirm.
- Saved homes: save, unsave, list saved homes.
- Messages: conversations, unread counts, read state, and message notifications.
- Payments: deposit request, checkout intent, payment lookup, signed and idempotent webhook boundary.
- Contracts: draft contract creation and lookup.
- Owner: portfolio, booking queue, listing management.
- Admin: metrics, verification review, disputes, audit logs, access boundary.
- Notifications/PWA: notification outbox, push subscription, and app-state endpoints.

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

Backend API contract:

```text
http://localhost:4000/api-docs
http://localhost:4000/api-docs.json
```

API responses should keep stable fields:

- `id`
- `status`
- `createdAt`
- `updatedAt`
- ISO date strings
- image URLs, not raw file bytes

## Notes

This backend now has a production-ready service foundation: guarded routes, DTO validation, Prisma data access, env validation, Docker build, migration path, seed data, and S3-compatible listing image uploads. Real external adapters are still needed for SMS OTP delivery, payment settlement/reconciliation, push notifications, private document storage policies, and observability before handling real transactions.
