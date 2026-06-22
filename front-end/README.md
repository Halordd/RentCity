# RentCity Frontend

## Source structure

- `src/main.jsx`: React entrypoint.
- `src/app/`: provider, router, app shell.
- `src/api/`: backend HTTP client placeholder.
- `src/services/`: feature services that can later call backend APIs.
- `src/components/`: reusable UI components.
- `src/features/web/`: desktop website.
- `src/features/app/`: mobile app shell.
- `src/features/web-app/`: phone web app/PWA.
- `src/features/admin/`: internal Admin Console.
- `src/data.js`: sample listings, assets, and admin rows.
- `src/utils.js`: small shared helpers.

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
cmd /c npm install
cmd /c npm run check
cmd /c npm run build
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
