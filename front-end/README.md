# RentCity Frontend

RentCity is a frontend-only rental product prototype built as a maintainable React/Vite app. It separates the public web, mobile app shell, phone web app/PWA, and internal admin console into feature modules.

## Stack

- React 19
- Vite 6
- TypeScript strict mode
- React Router
- ESLint flat config
- Local mock data and `localStorage` state until backend APIs are ready

## Source Structure

- `src/main.tsx`: React entrypoint.
- `src/app/`: app provider, router bridge, context, shared hook.
- `src/api/`: typed HTTP client placeholder for backend integration.
- `src/services/`: feature services that currently read mock data and can later call real APIs.
- `src/components/`: reusable UI components.
- `src/features/web/`: desktop website.
- `src/features/app/`: mobile app shell.
- `src/features/web-app/`: phone web app/PWA.
- `src/features/admin/`: internal Admin Console.
- `src/data.ts`: sample listings and admin rows.
- `src/types.ts`: shared frontend contracts.
- `src/utils.ts`: small shared helpers.
- `public/.rentcity-assets/`: real rental/home images served by Vite.

## Run Local

```bash
cmd /c npm install
cmd /c npm start
```

Default URL:

```text
http://localhost:4173
```

Use another port:

```bash
cmd /c npm start -- --port 4174
```

## Quality Checks

```bash
cmd /c npm run typecheck
cmd /c npm run lint
cmd /c npm run build
cmd /c npm run check
```

`npm run check` runs TypeScript, ESLint, and production build.

## Routes

- Web: `/web`
- Mobile app shell: `/app`
- Phone web app/PWA: `/web_app`
- Admin console: `/admin`

## Backend Notes

- The app is frontend-only for now.
- `VITE_API_BASE_URL` is defined in `.env.example`.
- API handoff notes are in `docs/backend-requirements.md`.
- The current service layer is intentionally isolated so backend calls can replace mock reads without rewriting UI screens.
