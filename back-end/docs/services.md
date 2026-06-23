# RentCity Backend Services

This document describes the backend services/modules and what each one is responsible for.

## Service Map

| Module | Controller | Service | Responsibility |
| --- | --- | --- | --- |
| `health` | `HealthController` | none | Health check for deployment/monitoring |
| `auth` | `AuthController` | `AuthService` | OTP request/verify, logout, current user boundary |
| `users` | `UsersController` | `UsersService` | Tenant/owner/admin profile data |
| `listings` | `ListingsController` | `ListingsService` | Public listing search and listing detail |
| `bookings` | `BookingsController` | `BookingsService` | Availability, booking creation, reschedule, cancel |
| `saved` | `SavedController` | `SavedService` | Save/unsave/list saved homes |
| `messages` | `MessagesController` | `MessagesService` | Conversations and message creation |
| `owner` | `OwnerController` | `OwnerService` | Owner listing CRUD, images, owner booking confirmation |
| `admin` | `AdminController` | `AdminService` | Metrics, verification, listing review, disputes, audit logs |
| `payments` | `PaymentsController` | `PaymentsService` | Deposit request, payment detail, payment webhook |
| `contracts` | `ContractsController` | `ContractsService` | Contract creation and contract detail |
| `notifications` | `NotificationsController` | `NotificationsService` | PWA app state and push subscription |

## Auth Service

Current scaffold:

- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /auth/logout`
- `GET /me`

Production work needed:

- Store OTP challenge with TTL in Redis or database.
- Rate-limit phone number/IP.
- Issue JWT or secure session.
- Add refresh token/session revocation.
- Add guards and role decorators.

## Users Service

Current scaffold:

- `GET /users/me/profile`

Production work needed:

- Tenant profile.
- Owner profile.
- Admin user profile.
- Role and status management.
- Verification state mapping.

## Listings Service

Current scaffold:

- `GET /listings`
- `GET /listings/:id`

Production work needed:

- Search/filter by district, price, area, amenities, availability.
- Persist listing data with Prisma.
- Add image handling.
- Add geocoding fields.
- Add listing quality status and admin review status.

## Bookings Service

Current scaffold:

- `GET /listings/:id/availability`
- `POST /bookings`
- `PATCH /bookings/:id/reschedule`
- `PATCH /bookings/:id/cancel`

Production work needed:

- Prevent duplicate/overlapping booking slots.
- Validate tenant identity.
- Notify owner.
- Track booking status transitions.
- Add no-show/completed states.

## Saved Service

Current scaffold:

- `GET /me/saved-listings`
- `POST /me/saved-listings/:listingId`
- `DELETE /me/saved-listings/:listingId`

Production work needed:

- Persist saved listings per authenticated user.
- Return full listing cards for frontend compare views.
- Enforce unique user/listing pair.

## Messages Service

Current scaffold:

- `GET /conversations`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`

Production work needed:

- Store conversation participants.
- Add unread count.
- Add read receipts.
- Add attachment policy.
- Decide polling first or WebSocket gateway.

## Owner Service

Current scaffold:

- `GET /owner/listings`
- `POST /owner/listings`
- `PATCH /owner/listings/:id`
- `POST /owner/listings/:id/images`
- `GET /owner/bookings`
- `PATCH /owner/bookings/:id/confirm`

Production work needed:

- Owner-only guards.
- Listing ownership checks.
- Image upload workflow.
- Booking confirmation rules.
- Owner dashboard metrics.

## Admin Service

Current scaffold:

- `GET /admin/metrics`
- `GET /admin/verifications`
- `POST /admin/verifications/:id/approve`
- `POST /admin/verifications/:id/request-more`
- `POST /admin/listings/:id/review`
- `GET /admin/disputes`
- `PATCH /admin/disputes/:id`
- `GET /admin/audit-logs`

Production work needed:

- Admin-only guards.
- RBAC by admin role.
- Audit log on sensitive actions.
- Verification document privacy.
- Listing moderation workflow.
- Dispute state machine.

## Payments Service

Current scaffold:

- `POST /payments/deposits`
- `GET /payments/:id`
- `POST /payments/webhook`

Production work needed:

- Provider integration.
- Idempotent webhook handling.
- Payment status reconciliation.
- Receipt storage.
- Refund flow.

## Contracts Service

Current scaffold:

- `POST /contracts`
- `GET /contracts/:id`

Production work needed:

- Generate draft contract.
- Store contract PDF.
- Track signature state.
- Link contract to booking/payment/listing.

## Notifications Service

Current scaffold:

- `GET /me/app-state`
- `PATCH /me/app-state`
- `POST /notifications/push-subscriptions`

Production work needed:

- Push subscription storage.
- Booking reminders.
- Owner response reminders.
- Payment/contract notifications.
- SMS/email/push delivery adapters.

## Infrastructure Services

Current scaffold:

- PostgreSQL through Prisma.
- Redis container available through Docker Compose.

Production work needed:

- Redis for OTP TTL, rate limits, queues, and realtime fanout.
- Object storage for listing images, verification documents, receipts, and contracts.
- Monitoring/logging.
- Migration workflow.
