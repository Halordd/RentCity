# RentCity Backend

Backend scaffold for the RentCity rental platform.

## Stack

- NestJS
- Prisma
- PostgreSQL
- TypeScript
- JWT-ready auth boundary
- REST APIs prepared for the current frontend

## Folder Structure

```text
back-end/
  prisma/schema.prisma
  src/
    main.ts
    app.module.ts
    common/
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
cmd /c npm run dev
```

Database tools:

```bash
cmd /c npm run db:up
cmd /c npm run prisma:migrate
cmd /c npm run db:down
```

## Environment

Copy `.env.example` to `.env`.

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rentcity?schema=public"
JWT_SECRET="change-me"
PORT=4000
FRONTEND_ORIGINS="http://localhost:4173,http://localhost:4174"
```

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

This is a scaffold. Authentication, upload storage, permissions, payment providers, and realtime transport still need production implementation.
