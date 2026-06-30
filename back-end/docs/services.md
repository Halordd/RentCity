# RentCity Backend Services

This document describes the backend services/modules and what each one is responsible for.

## Service Map

| Module | Controller | Service | Responsibility |
| --- | --- | --- | --- |
| `health` | `HealthController` | `PrismaService` | Liveness and database readiness checks |
| `auth` | `AuthController` | `AuthService` | OTP request/verify, logout, current user boundary |
| `integrations` | none | provider interfaces | External service boundaries such as SMS, payment, and storage |
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

Current implementation:

- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /auth/logout`
- `GET /me`
- Stores OTP challenges with hashed codes and expiry.
- Limits OTP request volume per phone number.
- Sends OTP through the SMS provider interface.
- Issues JWT access tokens.
- Provides reusable JWT and role guards.

External adapters still needed:

- SMS OTP delivery provider.
- Rate limit store and refresh-token revocation if long sessions are required.

## Users Service

Current implementation:

- `GET /users/me/profile`
- `PATCH /users/me/profile`
- Reads and updates authenticated user profile fields.

External adapters still needed:

- Avatar/document storage if profiles later include uploads.

## Listings Service

Current implementation:

- `GET /listings`
- `GET /listings/:id`
- Public search for published listings.
- Filters by district, query text, price, bedrooms, pet support, and amenities.
- Returns listing images and owner summary.

External adapters still needed:

- Real image upload/storage.
- Geocoding provider for map coordinates.

## Bookings Service

Current implementation:

- `GET /listings/:id/availability`
- `POST /bookings`
- `PATCH /bookings/:id/reschedule`
- `PATCH /bookings/:id/cancel`
- Generates near-term viewing slots.
- Blocks already booked slots.
- Enforces tenant ownership for reschedule/cancel.

External adapters still needed:

- Calendar integration and reminder queue.

## Saved Service

Current implementation:

- `GET /me/saved-listings`
- `POST /me/saved-listings/:listingId`
- `DELETE /me/saved-listings/:listingId`
- Persists saved listings by authenticated user.
- Enforces unique user/listing pairs.
- Returns listing card data for frontend compare views.

## Messages Service

Current implementation:

- `GET /conversations`
- `POST /conversations`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`
- Stores conversations and messages.
- Enforces tenant/owner participant access.
- Reuses an existing listing conversation when available.

External adapters still needed:

- Realtime WebSocket gateway or polling strategy.
- Attachment storage policy.

## Owner Service

Current implementation:

- `GET /owner/listings`
- `POST /owner/listings`
- `PATCH /owner/listings/:id`
- `POST /owner/listings/:id/images`
- `POST /owner/listings/:id/images/upload-intent`
- `GET /owner/bookings`
- `PATCH /owner/bookings/:id/confirm`
- Owner/admin role guard.
- Listing ownership checks.
- Upload intent creation through the storage provider interface.
- Owner booking queue and booking confirmation.

External adapters still needed:

- Direct file upload flow for listing images.
- Owner notification delivery.

## Admin Service

Current implementation:

- `GET /admin/metrics`
- `GET /admin/verifications`
- `POST /admin/verifications/:id/approve`
- `POST /admin/verifications/:id/request-more`
- `POST /admin/listings/:id/review`
- `GET /admin/disputes`
- `PATCH /admin/disputes/:id`
- `GET /admin/audit-logs`
- Admin-only guard.
- Verification review flow.
- Listing moderation flow.
- Dispute status flow.
- Audit logs for sensitive moderation actions.

External adapters still needed:

- Private document storage and signed review URLs.
- More granular admin permissions if the team grows.

## Payments Service

Current implementation:

- `POST /payments/deposits`
- `GET /payments/:id`
- `POST /payments/webhook`
- Creates pending deposit records.
- Creates checkout intent through the payment gateway interface.
- Restricts payment detail to the paying user.
- Updates payment status by provider reference.
- Requires HMAC webhook signing when `PAYMENT_WEBHOOK_SECRET` is configured.
- Stores webhook events and marks duplicate provider retries as idempotent.

External adapters still needed:

- Provider integration.
- Signed webhook verification.
- Payment status reconciliation.
- Receipt storage.
- Refund flow.

## Contracts Service

Current implementation:

- `POST /contracts`
- `GET /contracts/:id`
- Creates draft contracts linked to listing and user.
- Allows contract lookup by contract user or listing owner.

External adapters still needed:

- PDF generation.
- Digital signature flow.
- Contract storage.

## Notifications Service

Current implementation:

- `GET /me/app-state`
- `PATCH /me/app-state`
- `POST /notifications/push-subscriptions`
- Stores app state per authenticated user.
- Stores web push subscription payloads.

External adapters still needed:

- Booking reminders.
- Owner response reminders.
- Payment/contract notifications.
- SMS/email/push delivery adapters.

## Infrastructure Services

Current implementation:

- PostgreSQL through Prisma.
- Redis container available through Docker Compose.
- Environment validation.
- Dockerfile for runtime image.
- Prisma migration and deployment command.
- Request id propagation and consistent error responses.
- OpenAPI generation for frontend/backend contract alignment.
- Provider interface layer for external integrations.
- Node built-in unit tests for key production boundaries.
- GitHub Actions backend quality gate.

Infrastructure adapters still needed:

- Redis for OTP TTL, rate limits, queues, and realtime fanout.
- Object storage for listing images, verification documents, receipts, and contracts.
- Monitoring/logging.
- Migration workflow.
