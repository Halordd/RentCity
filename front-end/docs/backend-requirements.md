# RentCity Backend Requirements

Tài liệu này liệt kê phần backend cần làm để nối với frontend RentCity. Frontend hiện tại là static app, không có backend, và state tạm thời đang nằm trong `localStorage`.

## 1. Auth, User, Role

- Đăng nhập bằng số điện thoại OTP.
- Session/token refresh.
- Hồ sơ người thuê: tên, email, số điện thoại, khu vực quan tâm.
- Hồ sơ chủ nhà: thông tin cá nhân, trạng thái xác minh, tài khoản nhận cọc.
- Role admin: owner, support, verifier, accountant, super admin.
- RBAC cho admin: duyệt tin, hoàn tiền, xuất dữ liệu, sửa quy tắc tự động.

## 2. Listings

- CRUD nhà/phòng/căn hộ cho thuê.
- Upload và quản lý ảnh thật.
- Trạng thái tin: draft, pending_review, published, paused, rejected.
- Thông tin giá: giá thuê, cọc, điện, nước, gửi xe, phí khác.
- Tiện ích: ban công, máy lạnh, máy giặt, thang máy, pet, camera, bếp riêng.
- Search/filter theo quận, giá, diện tích, tiện ích, ngày trống.
- Geocode địa chỉ và lưu tọa độ để hiển thị map.
- Điểm chất lượng tin đăng: ảnh, mô tả, giá, giấy tờ.

## 3. Booking

- Lịch trống theo từng nhà.
- Tạo lịch xem nhà.
- Đổi lịch, hủy lịch, xác nhận lịch.
- Trạng thái: pending_owner, confirmed, rescheduled, cancelled, completed, no_show.
- Gửi notification cho người thuê và chủ nhà.
- Lưu ghi chú khi đặt lịch.

## 4. Saved Homes

- Lưu/bỏ lưu nhà theo user.
- Lấy danh sách nhà đã lưu.
- So sánh nhanh các nhà đã lưu: giá, diện tích, cọc, phí, tiện ích.

## 5. Messaging

- Conversation giữa người thuê, chủ nhà và support.
- Gửi/nhận tin nhắn realtime hoặc polling.
- Đính kèm ảnh/tài liệu nếu cần.
- Read receipt, unread count.
- Lưu lịch sử phục vụ khiếu nại/cọc.

## 6. Payment, Deposit, Contract

- Tạo yêu cầu đặt cọc.
- Tích hợp cổng thanh toán hoặc ghi nhận chuyển khoản.
- Webhook trạng thái giao dịch.
- Biên nhận cọc.
- Hoàn tiền cọc.
- Hợp đồng thuê: bản nháp, xác nhận, ký, lưu file PDF.
- Hóa đơn/gói dịch vụ cho chủ nhà nếu có subscription.

## 7. Owner Dashboard

- Danh sách nhà chủ nhà đang quản lý.
- Pipeline khách thuê: mới liên hệ, đặt lịch, thương lượng, chờ hợp đồng.
- Metrics: số lịch xem, tỉ lệ xác nhận, doanh thu tháng, tin cần xử lý.
- Tự động hóa: nhắc lịch, nhắc phản hồi, tạo nhiệm vụ gọi lại.
- Không cấp quyền back-office: owner không được duyệt KYC, không được duyệt hoàn tiền, không được export dữ liệu hệ thống.

## 8. Admin

- Back-office tách khỏi Owner Dashboard.
- Duyệt xác minh chủ nhà.
- Duyệt/QA chất lượng tin đăng.
- Quản lý dispute/khiếu nại.
- Quản lý notification templates.
- Quản lý billing/subscription.
- Quản lý RBAC/phân quyền nội bộ.
- Data export: listing, booking, payment, contract, message logs.
- API keys/webhooks nếu cần tích hợp CRM/kế toán/Zalo OA.
- Feature flags: rollout map, escrow, AI QA.
- Audit logs cho hành động nhạy cảm.

## 9. Web App/PWA

- Đồng bộ dữ liệu người thuê trên phone browser.
- Hỗ trợ trạng thái online/offline nếu triển khai PWA đầy đủ.
- Push notification cho lịch xem, tin nhắn, cọc và hợp đồng.
- Manifest, icon, theme color, service worker nếu đưa lên production.

## 10. Notification

- SMS OTP.
- SMS/push/email xác nhận lịch xem.
- Nhắc chủ nhà phản hồi.
- Nhắc thanh toán/cọc/hợp đồng.
- Tin mới theo khu vực quan tâm.

## 11. Storage

- Ảnh nhà thật.
- CCCD/giấy sở hữu/tài liệu xác minh.
- Hợp đồng PDF.
- Biên nhận thanh toán.
- Cần phân quyền truy cập file theo role.

## 12. Suggested API Endpoints

Auth:
- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /auth/logout`
- `GET /me`

Listings:
- `GET /listings`
- `GET /listings/:id`
- `POST /owner/listings`
- `PATCH /owner/listings/:id`
- `POST /owner/listings/:id/images`
- `POST /admin/listings/:id/review`

Bookings:
- `GET /listings/:id/availability`
- `POST /bookings`
- `PATCH /bookings/:id/reschedule`
- `PATCH /bookings/:id/cancel`
- `PATCH /owner/bookings/:id/confirm`

Saved:
- `GET /me/saved-listings`
- `POST /me/saved-listings/:listingId`
- `DELETE /me/saved-listings/:listingId`

Messages:
- `GET /conversations`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`

Payments/contracts:
- `POST /payments/deposits`
- `GET /payments/:id`
- `POST /payments/webhook`
- `POST /contracts`
- `GET /contracts/:id`

Admin:
- `GET /admin/metrics`
- `GET /admin/verifications`
- `POST /admin/verifications/:id/approve`
- `POST /admin/verifications/:id/request-more`
- `GET /admin/disputes`
- `PATCH /admin/disputes/:id`
- `GET /admin/audit-logs`

PWA:
- `GET /me/app-state`
- `PATCH /me/app-state`
- `POST /notifications/push-subscriptions`

## 13. Frontend Integration Notes

- Frontend hiện dùng React + TypeScript, state tạm nằm trong `src/app/AppProvider.tsx`.
- Shared contracts nằm trong `src/types.ts`; backend nên map response theo các model `Listing`, `Booking`, `Message`, `AppState`.
- API client placeholder nằm ở `src/api/httpClient.ts` và đọc `VITE_API_BASE_URL`.
- Khi có BE, thay mock reads trong service layer bằng API calls:
  - Listing search/detail/saved: `src/services/listings.service.ts`.
  - Booking create/reschedule/cancel: `src/services/bookings.service.ts`.
  - Admin rows/metrics/actions: `src/services/admin.service.ts`.
  - User state, messages, payment, OTP: tách tiếp thành `user.service.ts`, `messages.service.ts`, `payments.service.ts`, `auth.service.ts`.
- Frontend route hiện dùng React Router path routing, production server cần fallback về `index.html`:
  - `/web`
  - `/web/search`
  - `/web/listing/:id`
  - `/web/booking/:id`
  - `/app`
  - `/app/search`
  - `/app/listing/:id`
  - `/app/booking/:id`
  - `/app/saved`
  - `/app/bookings`
  - `/app/messages`
  - `/app/payments`
  - `/app/account`
  - `/app/profile`
  - `/web_app`
  - `/web_app/search`
  - `/web_app/listing/:id`
  - `/web_app/booking/:id`
  - `/web_app/saved`
  - `/web_app/manage`
  - `/web_app/bookings`
  - `/web_app/messages`
  - `/web_app/payments`
  - `/web_app/account`
  - `/web_app/profile`
  - `/admin/:section` với các section nội bộ: overview, listings, verification, automation, billing, disputes, audit, access, settings.

## 14. Security Checklist

- Validate tất cả input phía server.
- Rate limit OTP, booking, message, upload.
- RBAC cho admin.
- Không public file CCCD/giấy tờ.
- Audit log cho approve, refund, export, role change.
- CSRF nếu dùng cookie session.
- CORS rõ domain frontend production.
- Sanitize nội dung message/listing description.

## 15. Minimum Backend MVP

Nếu cần làm nhanh để frontend nối được trước, ưu tiên:

1. Auth OTP + `/me`.
2. Listings search/detail.
3. Saved listings.
4. Booking create/reschedule/cancel.
5. Messages basic.
6. Owner listings CRUD.
7. Admin verification/listing review.
8. Payment/deposit status.
