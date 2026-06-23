# RentCity

RentCity là nền tảng tìm trọ, thuê nhà và quản lý nhà cho thuê. Dự án hiện là frontend hoàn chỉnh ở mức giao diện và luồng thao tác, chưa nối backend thật.

## Mục Đích

RentCity được thiết kế để giải quyết ba vấn đề chính trong thị trường thuê trọ/thuê nhà:

- Người thuê khó kiểm tra tin thật, giá thật, vị trí thật và lịch trống.
- Chủ nhà khó quản lý tin đăng, khách đặt lịch, thương lượng, cọc và hợp đồng.
- Đội vận hành cần một hệ thống riêng để duyệt tin, xác minh chủ nhà, xử lý khiếu nại và theo dõi chất lượng.

Mục tiêu của sản phẩm là gom toàn bộ hành trình thuê nhà vào một nền tảng rõ ràng: tìm nhà, lưu nhà, đặt lịch xem, nhắn tin, đặt cọc, theo dõi lịch hẹn, quản lý tin đăng và kiểm duyệt nội bộ.

## Cách RentCity Hoạt Động

RentCity được chia thành các bề mặt sử dụng riêng biệt:

- `Web`: website desktop cho người thuê tìm kiếm, xem chi tiết nhà và đặt lịch.
- `App`: giao diện app mobile cho người thuê, có tìm kiếm, lưu nhà, lịch xem, tin nhắn, thanh toán và tài khoản.
- `Web app`: bản chạy trên trình duyệt điện thoại/PWA, phục vụ người dùng không cài app.
- `Admin`: hệ thống nội bộ cho RentCity, tách riêng với quản lý nhà thông thường.

Hiện tại dữ liệu là mock/local state để frontend có thể chạy độc lập. Khi backend hoàn thành, service layer trong frontend sẽ thay dữ liệu mock bằng API thật.

## Workflow Chính

### Người Thuê

1. Vào web/app/web app.
2. Tìm nhà theo khu vực, giá, diện tích, tiện ích và trạng thái còn trống.
3. Xem chi tiết nhà với ảnh thật, thông tin giá, phí, mô tả, tiện ích và vị trí bản đồ.
4. Lưu nhà yêu thích để so sánh.
5. Đặt lịch xem nhà.
6. Nhắn tin/thương lượng với chủ nhà hoặc hỗ trợ.
7. Theo dõi lịch hẹn, trạng thái cọc, thanh toán và hợp đồng.

### Chủ Nhà

1. Tạo hồ sơ chủ nhà.
2. Đăng tin nhà/phòng/căn hộ cho thuê.
3. Thêm ảnh thật, giá, phí, tiện ích, mô tả và lịch trống.
4. Nhận yêu cầu xem nhà.
5. Xác nhận, đổi lịch hoặc phản hồi khách thuê.
6. Quản lý danh sách nhà, khách quan tâm, lịch hẹn, cọc và hợp đồng.

### Admin RentCity

1. Duyệt xác minh chủ nhà.
2. Kiểm tra chất lượng tin đăng.
3. Quản lý khiếu nại, thanh toán, hoàn cọc và hợp đồng.
4. Theo dõi audit log, phân quyền nội bộ và chỉ số vận hành.
5. Cấu hình rule tự động cho nhắc lịch, nhắc phản hồi và chăm sóc khách thuê.

## Luồng Sản Phẩm Tổng Quát

```text
Người thuê tìm nhà
  -> lọc kết quả
  -> xem chi tiết
  -> lưu/so sánh
  -> đặt lịch xem
  -> nhắn tin thương lượng
  -> đặt cọc
  -> ký hợp đồng

Chủ nhà đăng tin
  -> RentCity/Admin duyệt tin
  -> tin được hiển thị
  -> nhận khách đặt lịch
  -> xác nhận lịch
  -> quản lý cọc/hợp đồng

Admin vận hành
  -> xác minh chủ nhà
  -> kiểm duyệt tin
  -> xử lý tranh chấp
  -> quản lý thanh toán
  -> theo dõi audit và báo cáo
```

## Source Code

Frontend hiện nằm trong:

```text
front-end/
```

Stack hiện tại:

- React 19
- Vite 6
- TypeScript strict mode
- React Router
- ESLint flat config
- Mock service layer để dễ thay bằng API thật sau này

Các nhóm source chính:

```text
front-end/src/app/              App provider, state, router helpers
front-end/src/api/              HTTP client placeholder
front-end/src/services/         Service layer cho dữ liệu mock/API
front-end/src/components/       UI components dùng chung
front-end/src/features/web/     Website desktop
front-end/src/features/app/     Mobile app shell
front-end/src/features/web-app/ Phone web app/PWA
front-end/src/features/admin/   Admin console
front-end/src/data.ts           Mock data
front-end/src/types.ts          Shared TypeScript models
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

Các route chính:

- `/web`: website desktop.
- `/app`: app mobile shell.
- `/web_app`: web app/PWA chạy trên phone browser.
- `/admin`: admin console nội bộ.

## Kiểm Tra Chất Lượng

```bash
cd front-end
cmd /c npm run typecheck
cmd /c npm run lint
cmd /c npm run build
cmd /c npm run check
```

`npm run check` chạy TypeScript, ESLint và production build.

## Backend Cần Làm Sau

Repo hiện chưa có backend thật. Các phần cần backend gồm:

- Auth OTP, user profile, role và permission.
- Listing CRUD, upload ảnh thật, search/filter, map/geocode.
- Booking, lịch xem nhà, đổi lịch, hủy lịch, xác nhận lịch.
- Saved homes và so sánh nhà đã lưu.
- Messaging realtime hoặc polling.
- Payment/cọc, hoàn tiền, biên nhận.
- Contract PDF và trạng thái ký hợp đồng.
- Owner dashboard API.
- Admin verification, listing QA, dispute, billing, audit log.
- Notification SMS/email/push.

Tài liệu bàn giao backend chi tiết nằm trong:

```text
back-end/README.md
```

## Mô Hình Nhánh

- `main`: snapshot ổn định.
- `develop`: nhánh tích hợp sản phẩm.
- `developer/front-end`: nhánh frontend.
- `developer/back-end`: nhánh backend riêng, không chứa source frontend.
- `stagging`: nhánh staging theo yêu cầu dự án.
- `release/v0.1.0`: nhánh phiên bản đầu tiên.
