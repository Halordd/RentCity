# RentCity Backend API

Base URL for local development:

```text
http://localhost:4000
```

## Health

- `GET /health`

## Auth

- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /auth/logout`
- `GET /me`

## Listings

- `GET /listings`
- `GET /listings/:id`

## Owner

- `GET /owner/listings`
- `POST /owner/listings`
- `PATCH /owner/listings/:id`
- `POST /owner/listings/:id/images`
- `GET /owner/bookings`
- `PATCH /owner/bookings/:id/confirm`

## Bookings

- `GET /listings/:id/availability`
- `POST /bookings`
- `PATCH /bookings/:id/reschedule`
- `PATCH /bookings/:id/cancel`

## Saved Homes

- `GET /me/saved-listings`
- `POST /me/saved-listings/:listingId`
- `DELETE /me/saved-listings/:listingId`

## Messages

- `GET /conversations`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`

## Payments

- `POST /payments/deposits`
- `GET /payments/:id`
- `POST /payments/webhook`

## Contracts

- `POST /contracts`
- `GET /contracts/:id`

## Admin

- `GET /admin/metrics`
- `GET /admin/verifications`
- `POST /admin/verifications/:id/approve`
- `POST /admin/verifications/:id/request-more`
- `GET /admin/disputes`
- `PATCH /admin/disputes/:id`
- `GET /admin/audit-logs`
- `POST /admin/listings/:id/review`

## PWA And Notifications

- `GET /me/app-state`
- `PATCH /me/app-state`
- `POST /notifications/push-subscriptions`
