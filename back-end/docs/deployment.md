# RentCity Backend Deployment

This backend is prepared as a production-ready NestJS service foundation. The live production environment still needs real provider credentials for SMS, file storage, payment webhooks, and push notifications.

## Required Environment

```text
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/rentcity?schema=public
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_TTL_DAYS=30
PORT=4000
FRONTEND_ORIGINS=https://rentcity.vn,https://app.rentcity.vn
API_DOCS_ENABLED=false
OTP_TTL_SECONDS=300
OTP_REQUEST_LIMIT_PER_HOUR=5
SMS_PROVIDER=twilio
PAYMENT_PROVIDER=payos
STORAGE_PROVIDER=s3
PAYMENT_WEBHOOK_SECRET=replace-with-payment-webhook-secret
LOCAL_PAYMENT_CHECKOUT_BASE_URL=
UPLOAD_PUBLIC_BASE_URL=https://cdn.rentcity.vn/uploads
S3_BUCKET=rentcity-uploads
S3_REGION=ap-southeast-1
S3_ENDPOINT=
S3_ACCESS_KEY_ID=replace-with-storage-access-key
S3_SECRET_ACCESS_KEY=replace-with-storage-secret-key
S3_PUBLIC_BASE_URL=https://cdn.rentcity.vn/uploads
S3_FORCE_PATH_STYLE=false
S3_UPLOAD_EXPIRES_SECONDS=600
REDIS_URL=redis://HOST:6379
```

## Build

```bash
cmd /c npm ci
cmd /c npm run prisma:generate
cmd /c npm run build
```

Before merging or deploying backend changes, run:

```bash
cmd /c npm run ci
```

## Database

Use Prisma migrations in production:

```bash
cmd /c npm run prisma:deploy
```

Use seed data only for local or staging environments:

```bash
cmd /c npm run seed
```

## Docker

```bash
docker build -t rentcity-backend .
docker run --env-file .env -p 4000:4000 rentcity-backend
```

For the repository-level production Compose package, use the dedicated migration target instead of the runtime image:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml build migrate backend
docker compose --env-file .env.production -f docker-compose.production.yml up -d
```

`docker-compose.production.yml` starts `migrate` after PostgreSQL is healthy and starts `backend` only after the migration job exits successfully. The runtime backend image intentionally prunes dev dependencies, so it should not be used for ad hoc Prisma CLI commands.

## Release Checklist

- Set `NODE_ENV=production`.
- Rotate `JWT_SECRET` away from local examples.
- Set `PAYMENT_WEBHOOK_SECRET` and verify provider callbacks with `x-rentcity-signature`.
- Ensure payment providers send a stable event id; RentCity stores webhook events idempotently.
- Confirm the production Compose `migrate` job completed successfully or run `npm run prisma:deploy` in the deployment environment before the backend starts.
- Confirm `/health` responds after deploy.
- Confirm `/health/ready` can reach the production database.
- Confirm `/listings` returns `200`; an empty list is acceptable before public listings are created.
- Confirm error logs include the same request id returned in `x-request-id`.
- Keep `/api-docs` disabled in production unless the API contract should be public.
- Configure frontend apps with the deployed API base URL.
- Configure Redis before accepting OTP traffic so request limits are shared across instances.
- Configure SMS, payment, email, push, and production storage bucket policies before accepting real transactions.
- Confirm `STORAGE_PROVIDER=s3` can return a presigned upload URL and the uploaded object is readable through `S3_PUBLIC_BASE_URL`.

## External Providers Still Needed

- SMS OTP provider.
- Object storage credentials, bucket policy, CDN/domain, and lifecycle/backup rules.
- Payment gateway and signed webhook verification.
- Push notification service.
- Email or contract delivery provider.
- Observability: logs, metrics, tracing, and alerting.
