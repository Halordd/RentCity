# RentCity Frontend

Đây là nhánh frontend của RentCity. README này dành cho người phát triển giao diện và khác với README ở `main`, nơi dùng để giới thiệu tổng quan sản phẩm.

## Vai Trò Frontend

Frontend mô phỏng đầy đủ các bề mặt chính của RentCity trước khi nối backend thật:

- Web: website desktop cho người thuê tìm kiếm, xem chi tiết nhà và đặt lịch.
- App: giao diện mobile app cho người thuê sử dụng thường xuyên.
- Web app: bản chạy trên trình duyệt điện thoại/PWA.
- Admin: back-office nội bộ cho RentCity, tách riêng với phần quản lý nhà của chủ nhà.

Ứng dụng hiện dùng mock data và `localStorage` để test luồng thao tác. Khi backend sẵn sàng, thay service mock bằng API call mà không cần viết lại UI.

## Stack

- React 19
- Vite 6
- TypeScript strict mode
- React Router
- ESLint flat config
- CSS thuần trong `src/styles.css`
- Mock service layer trong `src/services/`

## Cấu Trúc Source

```text
front-end/
  index.html
  package.json
  tsconfig.json
  eslint.config.js
  public/.rentcity-assets/       Ảnh nhà thật dùng cho giao diện demo
  docs/backend-requirements.md   Ghi chú API cần backend triển khai
  src/
    main.tsx                     React entrypoint
    styles.css                   Toàn bộ style chính
    data.ts                      Mock listings, messages, admin rows
    types.ts                     Shared TypeScript models
    utils.ts                     Helper format tiền, route, asset
    api/httpClient.ts            API client placeholder
    app/                         App provider, state, router helper
    components/                  UI components dùng chung
    features/web/                Web desktop
    features/app/                Mobile app
    features/web-app/            Phone web app/PWA
    features/admin/              Admin console
```

## Chạy Local

```bash
cd front-end
cmd /c npm install
cmd /c npm start
```

URL mặc định:

```text
http://localhost:4173
```

Chạy port khác:

```bash
cmd /c npm start -- --port 4174
```

## Route Chính

- `/web`: web desktop.
- `/web/search`: kết quả tìm kiếm.
- `/web/listing/:id`: chi tiết nhà.
- `/web/booking/:id`: đặt lịch xem nhà.
- `/web/saved`: nhà đã lưu.
- `/web/messages`: tin nhắn web.
- `/web/payments`: cọc/thanh toán web.
- `/web/owner`: quản lý nhà cho chủ nhà.
- `/web/post`: đăng tin cho thuê.
- `/app`: mobile app.
- `/app/search`: tìm nhà trong app.
- `/app/listing/:id`: chi tiết nhà trong app.
- `/app/booking/:id`: đặt lịch trong app.
- `/app/saved`: nhà đã lưu.
- `/app/bookings`: lịch hẹn.
- `/app/messages`: tin nhắn.
- `/app/payments`: cọc/hợp đồng.
- `/app/account`: tài khoản/OTP.
- `/web_app`: phone web app/PWA.
- `/web_app/search`: tìm nhà trên phone browser.
- `/web_app/listing/:id`: chi tiết nhà.
- `/web_app/booking/:id`: đặt lịch.
- `/web_app/saved`: nhà đã lưu.
- `/web_app/manage`: nhà đang thuê.
- `/web_app/messages`: tin nhắn.
- `/web_app/payments`: cọc/hợp đồng.
- `/admin`: admin overview.
- `/admin/listings`: duyệt/QA tin đăng.
- `/admin/verification`: duyệt xác minh chủ nhà.
- `/admin/automation`: rule tự động.
- `/admin/billing`: thanh toán/billing.
- `/admin/disputes`: khiếu nại.
- `/admin/audit`: audit log.
- `/admin/access`: phân quyền.

## Scripts

```bash
cmd /c npm run typecheck
cmd /c npm run lint
cmd /c npm run build
cmd /c npm run check
cmd /c npm run preview
```

`npm run check` chạy TypeScript, ESLint và production build.

## E2E Test

Bộ test tự động nằm ở root repo để kiểm tra được cả frontend và backend contract:

```bash
cmd /c npm install
cmd /c npm run e2e
```

Backend cần chạy trước ở `http://localhost:4000`; Playwright sẽ tự mở frontend ở `http://localhost:4174` nếu port này chưa chạy. Chi tiết luồng test nằm trong `e2e/README.md`.

## CI Pipeline

GitHub Actions nằm ở `.github/workflows/rentcity-ci.yml`. Pipeline tự phát hiện workspace:

- Có `front-end/package.json` thì chạy frontend quality gate.
- Có `back-end/package.json` thì chạy backend quality gate với Postgres và Redis service.
- Có đủ frontend, backend và Playwright config thì chạy full-stack E2E.

## State Và Mock Data

- State tổng nằm trong `src/app/AppProvider.tsx`.
- Dữ liệu được lưu tạm vào `localStorage` để thao tác demo không mất ngay khi đổi màn.
- Mock listing/message/admin data nằm trong `src/data.ts`.
- Service mock nằm trong:
  - `src/services/listings.service.ts`
  - `src/services/bookings.service.ts`
  - `src/services/admin.service.ts`

## Nối Backend Sau Này

Frontend đã có API client placeholder tại:

```text
src/api/httpClient.ts
```

Biến môi trường:

```text
VITE_API_BASE_URL=
```

File mẫu:

```text
.env.example
```

Khi backend sẵn sàng, ưu tiên thay mock data ở service layer trước:

- Listing/search/detail/saved: `src/services/listings.service.ts`
- Booking create/reschedule/cancel: `src/services/bookings.service.ts`
- Admin rows/actions/metrics: `src/services/admin.service.ts`
- Auth, messages, payments nên tách tiếp thành service riêng khi có API thật.

Chi tiết endpoint BE cần làm nằm ở:

```text
docs/backend-requirements.md
```

## Quy Ước Khi Phát Triển

- Giữ UI tách theo feature: web, app, web-app, admin.
- Component dùng chung đặt trong `src/components/`.
- Type dùng chung đặt trong `src/types.ts`.
- Không gọi API trực tiếp trong component nếu có thể đưa qua `src/services/`.
- Khi thêm route mới, cập nhật router logic và README này.
- Khi sửa UI quan trọng, chạy `npm run check` trước khi commit.

## Build Production

```bash
cmd /c npm run build
cmd /c npm run preview
```

Khi deploy production, server cần fallback mọi route frontend về `index.html` để các route như `/web/listing/:id`, `/app/messages`, `/admin/audit` không bị 404 khi refresh.
