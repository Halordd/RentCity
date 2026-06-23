# RentCity Backend Deployment

This backend is prepared as a production-ready NestJS service foundation. The live production environment still needs real provider credentials for SMS, file storage, payment webhooks, and push notifications.

## Required Environment

```text
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/rentcity?schema=public
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
PORT=4000
FRONTEND_ORIGINS=https://rentcity.vn,https://app.rentcity.vn
OTP_TTL_SECONDS=300
UPLOAD_PUBLIC_BASE_URL=https://cdn.rentcity.vn/uploads
REDIS_URL=redis://HOST:6379
```

## Build

```bash
cmd /c npm ci
cmd /c npm run prisma:generate
cmd /c npm run build
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

Run migrations before starting or as a one-off release job:

```bash
docker run --env-file .env rentcity-backend npx prisma migrate deploy
```

## Release Checklist

- Set `NODE_ENV=production`.
- Rotate `JWT_SECRET` away from local examples.
- Run `npm run prisma:deploy`.
- Confirm `/health` responds after deploy.
- Configure frontend apps with the deployed API base URL.
- Configure SMS, storage, payment, email, and push adapters before accepting real transactions.

## External Providers Still Needed

- SMS OTP provider.
- Image/file storage.
- Payment gateway and signed webhook verification.
- Push notification service.
- Email or contract delivery provider.
- Observability: logs, metrics, tracing, and alerting.
