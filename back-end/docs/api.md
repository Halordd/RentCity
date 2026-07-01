# RentCity Backend API

Base URL for local development:

```text
http://localhost:4000
```

Interactive API contract:

```text
GET /api-docs
GET /api-docs.json
```

Authenticated endpoints require:

```text
Authorization: Bearer <accessToken>
```

All responses include `x-request-id`. Clients should keep this value when reporting API errors.

Error response shape:

```json
{
  "error": {
    "statusCode": 400,
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "timestamp": "2026-06-23T00:00:00.000Z",
    "path": "/example",
    "requestId": "..."
  }
}
```

OTP verification returns the token. In non-production mode the OTP request response includes `devCode` for local testing only.

## Health

- `GET /health`
- `GET /health/ready`

## Auth

- `POST /auth/otp/request` - body: `phone`
- `POST /auth/otp/verify` - body: `phone`, `code`
- `POST /auth/refresh` - body: `refreshToken`
- `POST /auth/logout` - optional body: `refreshToken`
- `GET /me` - authenticated

## Listings

- `GET /listings` - public search, published listings only
- `GET /listings/:id` - public listing detail, published listings only

## Owner

- `GET /owner/dashboard` - owner/admin
- `GET /owner/listings` - owner/admin
- `POST /owner/listings` - owner/admin
- `PATCH /owner/listings/:id` - owner/admin
- `POST /owner/listings/:id/images` - owner/admin
- `POST /owner/listings/:id/images/upload-intent` - owner/admin, returns upload URL and public image URL
- `GET /owner/bookings` - owner/admin
- `PATCH /owner/bookings/:id/confirm` - owner/admin

## Bookings

- `GET /listings/:id/availability`
- `GET /me/bookings` - authenticated
- `POST /bookings` - tenant login required
- `PATCH /bookings/:id/reschedule` - booking tenant only
- `PATCH /bookings/:id/cancel` - booking tenant only

## Saved Homes

- `GET /me/saved-listings` - authenticated
- `POST /me/saved-listings/:listingId` - authenticated
- `DELETE /me/saved-listings/:listingId` - authenticated

## Messages

- `GET /conversations` - authenticated
- `POST /conversations` - authenticated, creates or reuses tenant/owner/listing thread
- `GET /conversations/:id/messages` - participant only
- `POST /conversations/:id/messages` - participant only
- `PATCH /conversations/:id/read` - participant only

## Payments

- `POST /payments/deposits` - authenticated, returns payment record and checkout intent
- `GET /payments/:id` - payment owner only
- `POST /payments/webhook` - provider callback, signed with `x-rentcity-signature` in production, idempotent by provider event key

## Contracts

- `POST /contracts` - authenticated
- `GET /contracts/:id` - contract user or listing owner

## Admin

- `GET /admin/metrics` - admin only
- `GET /admin/listings` - admin only, review queue
- `GET /admin/verifications` - admin only
- `POST /admin/verifications/:id/approve` - admin only
- `POST /admin/verifications/:id/request-more` - admin only
- `GET /admin/disputes` - admin only
- `PATCH /admin/disputes/:id` - admin only
- `GET /admin/audit-logs` - admin only
- `POST /admin/listings/:id/review` - admin only

## PWA And Notifications

- `GET /me/app-state` - authenticated
- `PATCH /me/app-state` - authenticated
- `GET /me/notifications` - authenticated
- `PATCH /me/notifications/:id/read` - authenticated
- `POST /notifications/push-subscriptions` - authenticated
