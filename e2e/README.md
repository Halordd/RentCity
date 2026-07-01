# RentCity E2E Tests

Automated end-to-end tests for the main RentCity flows.

## Covered Flows

- Backend contract smoke: listings, uploads, OTP auth, booking, messaging, owner dashboard, admin verification.
- Web tenant: landing, search, listing detail, OTP login, booking, payments.
- Web owner center: owner dashboard and draft listing creation.
- Mobile app: search, listing, bookings, payments, messages with internal scroll.
- Phone web_app: PWA dashboard, search, listing, manage rented home, messages with internal scroll.
- Admin console: all main admin sections with an ADMIN session.

## Run Locally

Backend must be running and ready:

```bash
cd back-end
npm start
```

Frontend is started automatically by Playwright unless `http://localhost:4174` is already running.

```bash
npm install
npm run e2e
```

Optional environment variables:

```bash
E2E_BACKEND_URL=http://localhost:4000
E2E_FRONTEND_URL=http://localhost:4174
```

Use headed mode when debugging:

```bash
npm run e2e:headed
```
