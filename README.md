# RentCity Backend

This is the backend branch for RentCity. It is a modular NestJS backend, not a single API blob. The branch defines the framework, database layer, module boundaries, service responsibilities, and integration notes needed to connect the frontend to a real server.

Frontend work lives in `developer/front-end`. This branch should stay backend-only.

## Source

```text
back-end/
```

## Current Backend Stack

- Framework: NestJS 11
- HTTP adapter: Fastify
- ORM: Prisma
- Database: PostgreSQL
- Cache/queue candidate: Redis
- Language: TypeScript strict mode
- API style: REST
- Auth direction: OTP login + JWT/session boundary
- Architecture: modular monolith with isolated controllers/services/modules
- Dev environment: Docker Compose for PostgreSQL and Redis

## Start Here

Read:

```text
back-end/README.md
back-end/docs/architecture.md
back-end/docs/services.md
```

The backend is scaffolded and dependencies are locked with `package-lock.json`. Run setup inside `back-end/` when ready.
