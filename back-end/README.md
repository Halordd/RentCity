# RentCity Backend Handoff

This branch area is reserved for the backend implementation. The current product is frontend-only, so this file lists the backend contracts needed by the React frontend.

## Suggested Stack

- Node.js with NestJS or Express, or another framework the backend team prefers.
- PostgreSQL for relational data.
- Redis for OTP/session/rate-limit if needed.
- Object storage for listing photos, verification documents, contracts, and receipts.
- WebSocket or polling for messages and booking updates.

## Core Modules

- Auth and users: phone OTP, sessions, tenant profile, owner profile, admin roles.
- Listings: CRUD, search filters, amenities, real photos, geocode/map coordinates, review status.
- Bookings: availability, viewing request, reschedule, cancel, owner confirmation.
- Saved homes: save, unsave, compare saved listings.
- Messaging: tenant-owner-support conversations, read state, unread counts.
- Payments and deposits: deposit request, payment status, refund, receipts.
- Contracts: draft, confirm, sign, PDF storage.
- Owner dashboard: listing portfolio, tenant pipeline, booking metrics, automation.
- Admin console: owner verification, listing QA, disputes, billing, audit logs, RBAC.
- Notifications: OTP, booking confirmation, reminder, payment, contract, push subscription.

## Minimum MVP APIs

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
- `POST /owner/listings/:id/images`
- `POST /admin/listings/:id/review`

Bookings:

- `GET /listings/:id/availability`
- `POST /bookings`
- `PATCH /bookings/:id/reschedule`
- `PATCH /bookings/:id/cancel`
- `PATCH /owner/bookings/:id/confirm`

Saved:

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

- Frontend reads `VITE_API_BASE_URL` from `front-end/.env.example`.
- Shared frontend models are in `front-end/src/types.ts`.
- The HTTP placeholder is in `front-end/src/api/httpClient.ts`.
- Current mock reads can be replaced service by service:
  - Listings: `front-end/src/services/listings.service.ts`
  - Bookings: `front-end/src/services/bookings.service.ts`
  - Admin: `front-end/src/services/admin.service.ts`
  - Future split: `auth.service.ts`, `messages.service.ts`, `payments.service.ts`, `users.service.ts`

## Security Checklist

- Validate all server input.
- Rate-limit OTP, booking, message, and upload APIs.
- Enforce RBAC for admin actions.
- Keep identity documents and ownership documents private.
- Add audit logs for approve, refund, export, and role changes.
- Configure CORS for production frontend domains.
- Sanitize listing descriptions and message content.
