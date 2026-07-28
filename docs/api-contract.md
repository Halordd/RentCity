# RentCity API Contract

This document is the human-readable contract for the RentCity backend. The machine-readable contract is generated at:

```text
docs/api/openapi.json
```

Regenerate it after controller or DTO changes:

```bash
npm run api:generate
```

CI verifies it with:

```bash
npm run api:check
```

The frontend consumes the same contract through a generated TypeScript client:

```text
front-end/src/api/generated.ts
front-end/src/api/apiClient.ts
```

Frontend service files should call `apiClient` with operation keys such as `GET /listings/{id}` instead of hard-coded URL strings. This keeps route names, path params, query params, and request DTOs tied to `docs/api/openapi.json`.

## Base Contract

Default local API URL:

```text
http://localhost:4000
```

All successful responses use this envelope:

```json
{
  "data": {}
}
```

Errors use NestJS HTTP status codes with the global exception filter:

```json
{
  "statusCode": 401,
  "message": "Missing bearer token",
  "error": "Unauthorized",
  "requestId": "..."
}
```

Authenticated endpoints require:

```http
Authorization: Bearer <accessToken>
```

Primary roles:

```text
TENANT  - renter flows: save, book, message, deposit, contract detail
OWNER   - owner workspace: listings, bookings, images, owner dashboard
ADMIN   - admin console: verification, review, disputes, audit logs
```

## Auth

### POST /auth/otp/request

Starts OTP login.

Request:

```json
{
  "phone": "+84912345678"
}
```

Development response includes `devCode`. Production never exposes it.

### POST /auth/otp/verify

Verifies OTP and returns session tokens.

Request:

```json
{
  "phone": "+84912345678",
  "code": "123456"
}
```

Response data:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "refreshExpiresAt": "2026-07-31T00:00:00.000Z",
  "tokenType": "Bearer",
  "user": {
    "id": "...",
    "phone": "+84912345678",
    "role": "TENANT",
    "fullName": null
  }
}
```

### POST /auth/refresh

Rotates refresh session and returns a new auth session.

Request:

```json
{
  "refreshToken": "..."
}
```

### POST /auth/logout

Revokes a refresh token.

Request:

```json
{
  "refreshToken": "..."
}
```

### GET /me

Returns the authenticated user. Requires any authenticated role.

## Listings

### GET /listings

Public listing search.

Query:

```text
district=Quan 7
keyword=studio
minPrice=3000000
maxPrice=9000000
minArea=25
petAllowed=true
page=1
limit=20
```

Response data:

```json
{
  "items": [],
  "page": 1,
  "limit": 20,
  "total": 0
}
```

### GET /listings/:id

Public listing detail with images, owner summary, fees, amenities, and coordinates.

### GET /listings/:id/availability

Public viewing availability.

Response data:

```json
{
  "listingId": "studio-nguyen-van-cu",
  "slots": [
    {
      "date": "2026-07-04",
      "time": "09:00 - 11:00",
      "available": true
    }
  ]
}
```

## Tenant Workspace

### GET /me/saved-listings

Requires `TENANT`, `OWNER`, or `ADMIN` authenticated session.

### POST /me/saved-listings/:listingId

Saves a listing for the current user.

### DELETE /me/saved-listings/:listingId

Removes a saved listing.

### GET /me/bookings

Returns bookings owned by the current tenant. Admin can see all.

### POST /bookings

Creates a viewing request.

Request:

```json
{
  "listingId": "studio-nguyen-van-cu",
  "date": "2026-07-04",
  "timeSlot": "14:30 - 16:00",
  "note": "Can I view this after work?"
}
```

### PATCH /bookings/:id/reschedule

Allowed for booking tenant, listing owner, or admin.

Request:

```json
{
  "date": "2026-07-05",
  "timeSlot": "09:00 - 11:00"
}
```

### PATCH /bookings/:id/cancel

Allowed for booking tenant, listing owner, or admin.

## Conversations

All conversation routes require authentication. Users can only access conversations where they are tenant, owner, or admin.

### GET /conversations

Returns conversation summaries with last message and unread count.

### POST /conversations

Request:

```json
{
  "listingId": "studio-nguyen-van-cu",
  "ownerId": "owner-minh"
}
```

### GET /conversations/:id/messages

Returns ordered messages for a conversation.

### POST /conversations/:id/messages

Request:

```json
{
  "body": "Can I visit this room tomorrow?"
}
```

### PATCH /conversations/:id/read

Marks incoming unread messages as read.

## Payments

### POST /payments/deposits

Requires authentication.

Request:

```json
{
  "listingId": "studio-nguyen-van-cu",
  "amount": 1000000,
  "provider": "local"
}
```

### GET /payments/:id

Allowed for payment user, listing owner, or admin.

### POST /payments/webhook

Public provider callback. In production, `x-rentcity-signature` is required and must match `PAYMENT_WEBHOOK_SECRET`.

Request:

```json
{
  "reference": "rc_1719820000_abcd1234",
  "status": "PAID",
  "amount": 1000000,
  "provider": "payos",
  "eventId": "provider-event-id"
}
```

## Contracts

### POST /contracts

Requires authentication.

Request:

```json
{
  "listingId": "studio-nguyen-van-cu",
  "fileUrl": "https://cdn.rentcity.vn/contracts/contract-123.pdf"
}
```

### GET /contracts/:id

Allowed for contract user, listing owner, or admin.

## Owner Workspace

Owner endpoints require role `OWNER` or `ADMIN`.

### GET /owner/dashboard

Returns owner KPIs, pipeline, recent bookings, and support items.

### GET /owner/listings

Returns listings owned by the current owner. Admin can see all.

### POST /owner/listings

Creates a draft listing.

Request:

```json
{
  "title": "Studio Nguyen Van Cu",
  "description": "Bright studio with balcony and full furniture.",
  "address": "123 Nguyen Van Cu",
  "district": "Quan 7",
  "city": "Ho Chi Minh City",
  "price": 5800000,
  "deposit": 5800000,
  "area": 28,
  "bedrooms": 1,
  "bathrooms": 1,
  "floor": "Tang 5",
  "electricityFee": "4k/kWh",
  "waterFee": "100k/month",
  "parkingFee": "150k/month",
  "petAllowed": true,
  "amenities": ["May lanh", "Ban cong"]
}
```

### PATCH /owner/listings/:id

Updates a listing owned by the current owner. Admin can update all.

### POST /owner/listings/:id/images

Adds an image URL to a listing.

### POST /owner/listings/:id/images/upload-intent

Creates local upload metadata for listing images.

### GET /owner/bookings

Returns owner listing bookings.

### PATCH /owner/bookings/:id/confirm

Confirms a booking for an owned listing. Admin can confirm all.

## Admin Console

Admin endpoints require role `ADMIN`.

### GET /admin/metrics

Returns operational metrics.

### GET /admin/verifications

Returns owner verification queue.

### POST /admin/verifications/:id/approve

Approves an owner verification.

### POST /admin/verifications/:id/request-more

Requests more verification information.

### GET /admin/listings

Returns listing moderation queue.

### POST /admin/listings/:id/review

Request:

```json
{
  "status": "PUBLISHED",
  "note": "Photos and pricing look valid."
}
```

### GET /admin/disputes

Returns dispute queue.

### PATCH /admin/disputes/:id

Request:

```json
{
  "status": "RESOLVED",
  "note": "Resolved after contacting both sides."
}
```

### GET /admin/audit-logs

Returns admin audit log entries.

## Notifications And Client State

All routes require authentication.

### GET /me/app-state

Returns stored client state for the current user.

### PATCH /me/app-state

Request:

```json
{
  "payload": {
    "activeTab": "saved",
    "filters": {
      "district": "Quan 7"
    }
  }
}
```

### POST /notifications/push-subscriptions

Stores a browser push subscription.

### GET /me/notifications

Returns in-app notifications.

### PATCH /me/notifications/:id/read

Marks one notification as read.

## User Profile

### GET /users/me/profile

Returns profile for the current user.

### PATCH /users/me/profile

Request:

```json
{
  "fullName": "Nguyen Van An",
  "email": "tenant@rentcity.vn",
  "preferredArea": "Quan 7"
}
```

## Contract Rules For Frontend

- Treat `data` as the only success payload root.
- Persist `accessToken`, `refreshToken`, `refreshExpiresAt`, `tokenType`, and `user` after OTP verification.
- Retry authenticated requests only after a successful `/auth/refresh`.
- Redirect to login on `401`.
- Show no-permission state on `403`.
- Never depend on `devCode`; it is development-only.
- Do not call admin or owner routes from tenant screens.
- Payment webhook is server-to-server only and must not be called by frontend clients.
