# RentCity_Demo

Frontend demo for RentCity, a rental housing product with separated experiences for web, mobile app shell, mobile web app/PWA, and internal admin.

## Source

All frontend source code is inside:

```text
front-end/
```

Module layout:

```text
front-end/src/main.js
front-end/src/data.js
front-end/src/state.js
front-end/src/selectors.js
front-end/src/utils.js
front-end/src/components/shared.js
front-end/src/pages/web.js
front-end/src/pages/app.js
front-end/src/pages/web-app.js
front-end/src/pages/admin.js
```

## Run locally

```bash
cd front-end
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
