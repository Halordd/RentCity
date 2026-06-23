# RentCity

RentCity frontend for rental discovery, booking, tenant flows, owner workflows, phone web app/PWA, and internal admin operations.

## Source

Current frontend code is inside:

```text
front-end/
```

Backend handoff workspace:

```text
back-end/
```

Current stack:

- React 19
- Vite 6
- TypeScript strict mode
- React Router
- ESLint flat config
- Frontend-only mock service layer, ready to swap to real APIs later

Main source layout:

```text
front-end/src/main.tsx
front-end/src/app/
front-end/src/api/
front-end/src/services/
front-end/src/components/
front-end/src/features/web/
front-end/src/features/app/
front-end/src/features/web-app/
front-end/src/features/admin/
front-end/src/data.ts
front-end/src/types.ts
front-end/src/utils.ts
```

## Run Locally

```bash
cd front-end
cmd /c npm install
cmd /c npm start
```

Default URL:

```text
http://localhost:4173
```

Main routes:

- `/web` - desktop website
- `/app` - mobile app shell
- `/web_app` - phone web app/PWA
- `/admin` - internal admin console

## Quality Checks

```bash
cd front-end
cmd /c npm run typecheck
cmd /c npm run lint
cmd /c npm run build
cmd /c npm run check
```

## Branch Model

- `main`: stable project snapshot.
- `develop`: integration branch for active product work.
- `developer/front-end`: frontend implementation branch.
- `developer/back-end`: backend implementation branch.
- `stagging`: staging branch requested for release checks.
- `release/v0.1.0`: first tagged release branch.

Note: Git cannot have both a branch named `developer` and child-like branch names such as `developer/front-end`. The slash is branch grouping, not a real parent branch.

## Backend Handoff

This repository is frontend-only. Backend requirements are documented in:

```text
back-end/README.md
```
