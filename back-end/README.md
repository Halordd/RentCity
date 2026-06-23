# RentCity Backend Handoff

This folder is the starting point for the backend team. The current frontend expects these backend capabilities when the API is ready.

## Suggested Stack

- Node.js with NestJS or Express.
- PostgreSQL for users, listings, bookings, payments, messages, contracts, and audit logs.
- Redis for OTP, sessions, queues, rate limits, and realtime fanout if needed.
- Object storage for listing photos, verification documents, contracts, and receipts.
- WebSocket or polling for messages and booking state.

## Minimum Modules

- Auth: phone OTP, token/session refresh, logout, current user.
- Users: tenant profile, owner profile, admin roles and permissions.
- Listings: CRUD, real image upload, search, filter, map coordinates, listing QA.
- Bookings: availability, booking request, reschedule, cancel, owner confirm.
- Saved homes: save, unsave, compare saved listings.
- Messages: conversations, message send/read, unread count.
- Payments: deposits, webhook status, receipts, refund tracking.
- Contracts: draft, confirm, sign, PDF storage.
- Owner dashboard: portfolio, tenant pipeline, booking metrics, automation.
- Admin console: verification, listing review, disputes, billing, audit logs, RBAC.
- Notifications: OTP, booking reminder, payment, contract, push subscription.

## MVP API Endpoints

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

## Frontend Contract Notes

- Frontend base URL comes from `VITE_API_BASE_URL`.
- Frontend models to match later: `Listing`, `Booking`, `Message`, `AppState`.
- API responses should use stable IDs, ISO timestamps, explicit status fields, and image URLs.
- Production web server should support frontend route fallback to `index.html`.

## Security Checklist

- Validate all input on the server.
- Rate-limit OTP, booking, message, and upload APIs.
- Enforce RBAC for admin actions.
- Keep identity and ownership documents private.
- Add audit logs for approve, refund, export, and role changes.
- Configure CORS for final frontend domains.
- Sanitize listing descriptions and message content.
