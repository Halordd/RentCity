# RentCity Backend API

Base URL for local development:

```text
http://localhost:4000
```

Authenticated endpoints require:

```text
Authorization: Bearer <accessToken>
```

OTP verification returns the token. In non-production mode the OTP request response includes `devCode` for local testing only.

## Health

- `GET /health`

## Auth

- `POST /auth/otp/request` - body: `phone`
- `POST /auth/otp/verify` - body: `phone`, `code`
- `POST /auth/logout`
- `GET /me` - authenticated

## Listings

- `GET /listings` - public search, published listings only
- `GET /listings/:id` - public listing detail, published listings only

## Owner

- `GET /owner/listings` - owner/admin
- `POST /owner/listings` - owner/admin
- `PATCH /owner/listings/:id` - owner/admin
- `POST /owner/listings/:id/images` - owner/admin
- `GET /owner/bookings` - owner/admin
- `PATCH /owner/bookings/:id/confirm` - owner/admin

## Bookings

- `GET /listings/:id/availability`
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

## Payments

- `POST /payments/deposits` - authenticated
- `GET /payments/:id` - payment owner only
- `POST /payments/webhook` - public provider callback placeholder

## Contracts

- `POST /contracts` - authenticated
- `GET /contracts/:id` - contract user or listing owner

## Admin

- `GET /admin/metrics` - admin only
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
- `POST /notifications/push-subscriptions` - authenticated
