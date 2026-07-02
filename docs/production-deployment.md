# RentCity Production Deployment

This package deploys the RentCity release as Docker services:

- `frontend`: Nginx static hosting for the Vite build with SPA fallback.
- `backend`: NestJS API server.
- `migrate`: one-shot Prisma migration job that must finish before the backend starts.
- `postgres`: PostgreSQL database.
- `redis`: OTP/session/rate-limit backing store.

## 1. Prepare Environment

Copy the production env example:

```bash
copy .env.production.example .env.production
```

Edit `.env.production` before deploying:

- Change `POSTGRES_PASSWORD`.
- Change `JWT_SECRET`.
- Change `PAYMENT_WEBHOOK_SECRET`.
- Set `FRONTEND_ORIGINS` to the real frontend domain.
- Set `VITE_API_BASE_URL`, `UPLOAD_PUBLIC_BASE_URL`, and `S3_PUBLIC_BASE_URL` to the deployed public URLs.
- If `STORAGE_PROVIDER=s3`, set `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and optional `S3_ENDPOINT`.
- Keep `API_DOCS_ENABLED=false` unless API docs should be public.

For real transactions, replace local providers:

```text
SMS_PROVIDER=twilio
PAYMENT_PROVIDER=payos
STORAGE_PROVIDER=s3
```

The S3-compatible storage adapter is implemented for listing image upload intents. SMS, payment settlement, push/email delivery, storage bucket policies, and private document access rules still need real provider credentials and operational setup before production money or identity flows go live.

## 2. Build Images

```bash
docker compose --env-file .env.production -f docker-compose.production.yml build migrate frontend backend
```

The backend image has two production targets:

- `migrate`: keeps the Prisma CLI available and runs `prisma migrate deploy`.
- `runtime`: prunes dev dependencies and runs only the NestJS API.

## 3. Start Services

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d
```

On startup, Compose runs this order:

1. `postgres` and `redis` become healthy.
2. `migrate` applies all Prisma migrations and exits successfully.
3. `backend` starts only after `migrate` has completed.
4. `frontend` starts only after `backend` is healthy.

Do not run schema changes manually inside the runtime backend container. The runtime image intentionally omits dev-only tooling.

## 4. Optional Seed For Staging Or Demo

Seed only staging/demo environments:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml run --rm migrate npm run seed
```

Do not seed production after real users exist unless the seed is explicitly designed to be safe for production.

## 5. Verify

Default local production URLs:

```text
Frontend: http://localhost:8080
Backend:  http://localhost:4000
Health:   http://localhost:4000/health/ready
```

Health and API smoke:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
curl http://localhost:4000/health
curl http://localhost:4000/health/ready
curl http://localhost:4000/listings
curl http://localhost:8080/healthz
```

Migration logs:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml logs migrate
```

An unseeded production database can validly return an empty listing response:

```json
{"data":{"items":[],"page":1,"limit":20,"total":0}}
```

Browser smoke:

- Open `/web`.
- Search listings.
- Open a listing detail.
- Request OTP in a non-production SMS provider environment only.

## 6. Stop

```bash
docker compose --env-file .env.production -f docker-compose.production.yml down
```

For local/staging resets only:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml down -v --remove-orphans
```

## 7. Clean Local Docker Build History

Docker Desktop shows one build record every time `docker compose build` runs. Clean local build history and build cache when old records are no longer needed:

```bash
npm run docker:clean
```

Equivalent Docker commands:

```bash
docker buildx history rm --all
docker buildx prune -af
```

This only cleans local Docker build records/cache. It does not remove Git history or source files.

## 8. Rollback

Checkout a release tag and rebuild:

```bash
git fetch --tags
git checkout v0.2.10
docker compose --env-file .env.production -f docker-compose.production.yml build migrate frontend backend
docker compose --env-file .env.production -f docker-compose.production.yml up -d
```

Database rollbacks are not automatic. Prefer forward-fix migrations unless a manual database rollback plan has been tested.

## 9. Operations Checklist

- `JWT_SECRET` is rotated and stored outside Git.
- `PAYMENT_WEBHOOK_SECRET` is set and not shared with frontend code.
- PostgreSQL volume is backed up.
- Redis persistence is acceptable for OTP/rate-limit needs.
- Upload volume or object storage is backed up.
- `/health/ready` is monitored.
- Logs retain request ids from `x-request-id`.
- TLS and reverse proxy are configured outside this compose file.
- CORS `FRONTEND_ORIGINS` matches deployed frontend domains.
- API docs are disabled for public production.
- The `migrate` service completed successfully for the deployed release.
- The `/listings` smoke check returns `200`, even if the database has no public listings yet.
