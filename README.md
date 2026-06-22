# RentCity_Demo

RentCity frontend for rental discovery, booking, tenant flows, owner workflows, phone web app/PWA, and internal admin operations.

## Source

All frontend code is inside:

```text
front-end/
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

## Backend Handoff

This repository is frontend-only. Backend requirements are documented in:

```text
front-end/docs/backend-requirements.md
```
