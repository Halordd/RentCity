# RentCity_Demo

Frontend demo for RentCity, a rental housing product with separated experiences for web, mobile app shell, mobile web app/PWA, and internal admin.

## Source

All frontend source code is inside:

```text
front-end/
```

React/Vite module layout:

```text
front-end/src/main.jsx
front-end/src/app/
front-end/src/api/
front-end/src/services/
front-end/src/components/
front-end/src/features/web/
front-end/src/features/app/
front-end/src/features/web-app/
front-end/src/features/admin/
front-end/src/data.js
front-end/src/utils.js
```

## Run locally

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

## Notes

- This repository is frontend-only.
- No backend API is enabled.
- Backend requirements are documented in `front-end/docs/backend-requirements.md`.
