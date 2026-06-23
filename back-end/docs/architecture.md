# RentCity Backend Architecture

RentCity backend uses a modular NestJS architecture. The goal is to avoid a single unstructured API layer while keeping the MVP simple enough to build quickly.

## Architecture Style

Current style:

```text
Modular monolith
```

This means:

- One backend application is deployed.
- Each business domain has its own module.
- Each module owns its controller and service.
- Shared infrastructure such as Prisma is isolated under `src/database`.
- Provider boundaries such as SMS live under `src/integrations`.
- The code can later be split into independent services if needed.

## Framework And Runtime

- Framework: NestJS 11
- HTTP layer: Fastify via `@nestjs/platform-fastify`
- Language: TypeScript strict mode
- API style: REST
- ORM: Prisma
- Database: PostgreSQL
- Cache/queue candidate: Redis
- Local infrastructure: Docker Compose

## Why NestJS

NestJS is used because RentCity has many business domains:

- auth
- users
- listings
- bookings
- saved homes
- messages
- owner dashboard
- admin console
- payments
- contracts
- notifications

NestJS gives clear module boundaries, dependency injection, controllers, services, guards, pipes, and testing structure. That fits this project better than a flat Express app.

## Why Fastify

The backend uses Fastify instead of Express.

Reasons:

- Smaller runtime dependency surface.
- Better performance baseline.
- Avoids pulling upload middleware before real upload handling is designed.
- Current `npm audit` passes with `0 vulnerabilities`.

If production file upload requires multipart handling later, add it intentionally with validation, file size limits, storage policy, and security checks.

## Layer Structure

```text
HTTP request
  -> Controller
  -> Service
  -> Integration provider or PrismaService
  -> PrismaService
  -> PostgreSQL
```

Controller responsibilities:

- Define routes.
- Read params/body/query.
- Return API response shape.
- Avoid heavy business logic.

Service responsibilities:

- Own business rules.
- Call Prisma or external integrations.
- Prepare response payloads.
- Keep module behavior testable.

Database responsibilities:

- Prisma schema defines data models.
- PrismaService owns database connection lifecycle.
- Migrations should be created through Prisma.

Integration responsibilities:

- Define provider interfaces.
- Keep third-party provider details out of domain services.
- Allow local providers in development and real providers in production.

## Folder Layout

```text
src/
  main.ts
  app.module.ts
  common/
    auth/
    dto/
  config/
    env.validation.ts
    openapi.ts
  database/
    database.module.ts
    prisma.service.ts
  integrations/
    sms/
  modules/
    auth/
    users/
    listings/
    bookings/
    saved/
    messages/
    owner/
    admin/
    payments/
    contracts/
    notifications/
    health/
```

Each module follows this pattern:

```text
module-name/
  module-name.module.ts
  module-name.controller.ts
  module-name.service.ts
  dto/
```

DTO folders are used for request validation and API boundary typing.

## Data Model Groups

Prisma models are grouped around:

- Identity: `User`
- Rental inventory: `Listing`, `ListingImage`
- Scheduling: `Booking`
- Saved homes: `SavedListing`
- Communication: `Conversation`, `Message`
- Money flow: `Payment`
- Legal flow: `Contract`
- Trust and moderation: `Verification`, `AuditLog`
- App/PWA state: `AppState`, `PushSubscription`

## External Services To Add Later

The service has provider boundaries and can add provider-specific adapters under `src/integrations`:

- SMS/OTP provider: Twilio, Zalo ZNS, Viettel, FPT, or similar.
- Object storage: S3-compatible storage, Cloudinary, or Firebase Storage.
- Payment provider: Stripe, PayOS, MoMo, VNPay, bank transfer reconciliation, or another local provider.
- Email/push notification: SendGrid, Resend, Firebase Cloud Messaging, or web push.
- Maps/geocoding: Google Maps, Mapbox, HERE, or another geocoding provider.
- Realtime messaging: WebSocket gateway or polling first, then Redis pub/sub if needed.

## Production Rules

- Validate required environment variables on boot.
- Never put business logic directly in controllers.
- Keep module service boundaries clear.
- Keep auth, owner, and admin permissions separate.
- Validate request DTOs before touching services.
- Use Prisma migrations for schema changes.
- Keep private files such as identity documents behind signed URLs or protected routes.
- Add audit logs for sensitive admin actions.
- Do not connect payment or upload providers without explicit validation and failure handling.
