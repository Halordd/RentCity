# RentCity Backend Requirements

This document tracks what the frontend expects from the backend. The React frontend reads `VITE_API_BASE_URL`, attaches bearer tokens, attempts refresh on `401`, and keeps local/mock fallback behavior only for development.

## Status After Release `v0.2.10`

The backend now has a NestJS + Prisma production foundation:

- OTP auth boundary, access token, refresh token, logout, and `/me`.
- Public listing search/detail.
- Saved listings.
- Booking create/reschedule/cancel and owner confirmation.
- Conversations, messages, read state, unread counts, and notification outbox.
- Owner dashboard and listing management.
- Admin metrics, verification queue, listing review, disputes, audit logs, and access boundary.
- Deposit payment boundary, local checkout intent, signed webhook validation, and idempotent webhook event storage.
- Draft contracts.
- OpenAPI contract in `docs/api/openapi.json` and generated frontend API types.
- Docker production compose with a dedicated `migrate` service before backend startup.
- CI gates for frontend, backend, production security, full-stack E2E, and Docker runtime smoke.
- Local storage upload intents for development and S3-compatible presigned PUT upload intents for listing images.

## Still Needed Before Real Production

- Real SMS OTP provider, retry rules, anti-abuse rules, and delivery monitoring.
- Real payment gateway integration, reconciliation, refunds, payouts, and accounting export.
- Production object storage setup: bucket, credentials, CDN/public base URL, lifecycle rules, backups, and access policies.
- Private file authorization for identity documents, ownership documents, contracts, and payment receipts.
- Map/geocoding provider for normalized addresses, coordinates, and nearby search.
- Push/email providers, templates, delivery status, and retry handling.
- Full KYC workflow for owners, property ownership proof, internal notes, and audit trails.
- Centralized logs, metrics, tracing, alerts, and production dashboards.
- PostgreSQL backup/restore strategy and disaster recovery drills.
- More granular admin RBAC for verifier, support, accountant, and super admin roles.
- Frontend integration for real payment, contract, private document, and owner automation APIs.

## Main API Areas

Auth:
- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /auth/logout`
- `GET /me`

Listings:
- `GET /listings`
- `GET /listings/:id`
- `POST /owner/listings`
- `PATCH /owner/listings/:id`
- `POST /owner/listings/:id/upload-intent`
- `POST /owner/listings/:id/images`
- `POST /admin/listings/:id/review`

Bookings:
- `GET /listings/:id/availability`
- `POST /bookings`
- `PATCH /bookings/:id/reschedule`
- `PATCH /bookings/:id/cancel`
- `PATCH /owner/bookings/:id/confirm`

Saved homes:
- `GET /me/saved-listings`
- `POST /me/saved-listings/:listingId`
- `DELETE /me/saved-listings/:listingId`

Messages:
- `GET /conversations`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`

Payments and contracts:
- `POST /payments/deposits`
- `GET /payments/:id`
- `POST /payments/webhook`
- `POST /contracts`
- `GET /contracts/:id`

Admin:
- `GET /admin/metrics`
- `GET /admin/verifications`
- `POST /admin/verifications/:id/approve`
- `POST /admin/verifications/:id/request-more`
- `GET /admin/disputes`
- `PATCH /admin/disputes/:id`
- `GET /admin/audit-logs`

PWA/app state:
- `GET /me/app-state`
- `PATCH /me/app-state`
- `POST /notifications/push-subscriptions`

## Frontend Integration Notes

- Frontend routes are split into three product surfaces: web, app/mobile, and web_app/PWA.
- Shared API client code lives in `src/api`.
- Generated API types live in `src/api/generated.ts`.
- Run `npm run api:generate` at the repository root after backend contract changes.
- Production hosting must fall back to `index.html` for all frontend routes.

## Security Checklist

- Validate all server input with DTOs.
- Rate limit OTP, booking, messaging, and upload intent endpoints.
- Enforce owner/admin/tenant role boundaries on every protected route.
- Do not expose identity documents, property documents, or contracts through public URLs.
- Audit sensitive actions: approve, reject, refund, export, role change, and provider config changes.
- Keep production CORS restricted to deployed frontend domains.
- Keep `/api-docs` disabled publicly unless intentionally exposed.
