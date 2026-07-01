# RentCity Production Deployment

This package deploys the RentCity release as Docker services:

- `frontend`: Nginx static hosting for the Vite build with SPA fallback.
- `backend`: NestJS API server.
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
- Set `VITE_API_BASE_URL` and `UPLOAD_PUBLIC_BASE_URL` to the public backend URL.
- Keep `API_DOCS_ENABLED=false` unless API docs should be public.

For real transactions, replace local providers:

```text
SMS_PROVIDER=twilio
PAYMENT_PROVIDER=payos
STORAGE_PROVIDER=s3
```

Those real adapters still need provider credentials and implementation before production money or identity flows go live.

## 2. Build Images

```bash
docker compose --env-file .env.production -f docker-compose.production.yml build
```

## 3. Run Database Migrations

Start database dependencies:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d postgres redis
```

Run migrations as a one-off release job:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml run --rm backend npx prisma migrate deploy
```

Seed only staging/demo environments:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml run --rm backend npm run seed
```

Do not seed production after real users exist unless the seed is explicitly designed to be idempotent for production.

## 4. Start Services

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d
```

Default local production URLs:

```text
Frontend: http://localhost:8080
Backend:  http://localhost:4000
Health:   http://localhost:4000/health/ready
```

## 5. Verify

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
curl http://localhost:4000/health
curl http://localhost:4000/health/ready
curl http://localhost:8080/healthz
```

Browser smoke:

- Open `/web`.
- Search listings.
- Open a listing detail.
- Request OTP in a non-production SMS provider environment only.

## 6. Rollback

Checkout a release tag and rebuild:

```bash
git fetch --tags
git checkout v0.2.0
docker compose --env-file .env.production -f docker-compose.production.yml build
docker compose --env-file .env.production -f docker-compose.production.yml up -d
```

Database rollbacks are not automatic. Prefer forward-fix migrations unless a manual database rollback plan has been tested.

## 7. Operations Checklist

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
