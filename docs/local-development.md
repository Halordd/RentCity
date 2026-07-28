# RentCity Local Development

This guide is for running the integrated `develop` branch locally.

## Requirements

- Node.js 22
- Docker Desktop
- npm

## Install

```bash
npm ci
npm --prefix front-end ci
npm --prefix back-end ci
```

Or use the root helper:

```bash
npm run install:all
```

## Environment

Create local env files from the examples:

```bash
copy back-end\.env.example back-end\.env
copy front-end\.env.example front-end\.env
```

The default local URLs are:

```text
Backend:  http://localhost:4000
Frontend: http://localhost:4174
```

## Database

```bash
npm run db:up
npm --prefix back-end run prisma:generate
npm --prefix back-end run prisma:migrate
npm run db:seed
```

## Run

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

## Quality Gates

Fast local check:

```bash
npm run check
```

Backend CI-level check requires `DATABASE_URL` and other backend env values:

```bash
npm run ci:backend
```

Full-stack E2E requires backend and frontend to be reachable:

```bash
npm run e2e
```

## Branch Flow

- `developer/front-end`: frontend work.
- `developer/back-end`: backend work.
- `develop`: integration branch for full-stack testing.
- `stagging`: staging branch, fast-forwarded from a verified `develop`.
