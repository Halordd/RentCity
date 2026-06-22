# RentCity Frontend

## Source structure

- `src/main.js`: router and event handlers.
- `src/data.js`: sample listings, assets, and admin rows.
- `src/state.js`: localStorage state.
- `src/selectors.js`: derived data and filtering.
- `src/utils.js`: small shared helpers.
- `src/components/shared.js`: shared UI components.
- `src/pages/web.js`: desktop website.
- `src/pages/app.js`: mobile app shell.
- `src/pages/web-app.js`: phone web app/PWA.
- `src/pages/admin.js`: internal Admin Console.

RentCity hiện là frontend/static app cho tìm trọ, thuê nhà và quản lý nhà thuê. Repo này không có backend; dữ liệu tạm thời đang nằm trong `localStorage` để các luồng frontend có thể thao tác được.

## Chạy local

```bash
npm start
```

Mặc định app chạy tại `http://localhost:4173`. Có thể đổi port:

```bash
PORT=4174 npm start
```

Trên PowerShell nếu `npm` bị chặn execution policy, chạy:

```bash
cmd /c npm start
```

## Kiểm tra

```bash
cmd /c npm run check
node --check server.mjs
```

## Các nền tảng

- Web: `/web` cho website desktop, gồm landing, search/filter, listing detail, booking, saved homes, messages, payments, post listing và owner dashboard. Owner dashboard chỉ dành cho chủ nhà quản lý tin của họ.
- App: `/app` cho mobile app shell, gồm home, search, listing detail, booking, saved homes, bookings, messages, payments và profile.
- Web app: `/web_app` cho PWA/web chạy trên trình duyệt phone, gồm tìm nhà, xem tin, booking, quản lý nhà đang thuê, lịch xem, messages, payments và hồ sơ.
- Admin: `/admin` cho back-office nội bộ, tách khỏi owner dashboard, gồm command center, kiểm duyệt tin, KYC chủ nhà, quy tắc hệ thống, tài chính đối soát, khiếu nại, audit logs, phân quyền và settings.

## Ghi chú frontend

- Server chỉ phục vụ static file. Các request `/api/*` trả `404` để không giả lập backend.
- Ảnh thật đang nằm trong `.rentcity-assets`.
- Icon app là `src/rentcity-icon.svg`.
- Tài liệu backend cần làm nằm tại `docs/backend-requirements.md`.
