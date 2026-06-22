import { listingById, listings } from '../data.js';
import { state } from '../state.js';
import { filteredListings } from '../selectors.js';
import { escapeHtml, money } from '../utils.js';
import { appLogo, emptyState, listingCard, searchForm, setApp } from '../components/shared.js';

export function renderApp(path = "home", id) {
  const pages = {
    home: mobileHome,
    search: mobileSearch,
    listing: () => mobileListing(id),
    booking: () => mobileBooking(id),
    saved: mobileSaved,
    bookings: mobileBookings,
    profile: mobileProfile,
    messages: () => phoneMessagesPage("/app"),
    payments: () => phonePaymentsPage("/app"),
    account: () => phoneAccountPage("/app")
  };
  return setApp(`<main class="mobile-stage">${phoneShell(path, (pages[path] || mobileHome)(), "app")}</main>`);
}

function phoneShell(active, content, shellType = "app") {
  const nav = [
    ["home", "Home"],
    ["search", "Tìm"],
    ["saved", "Lưu"],
    ["bookings", "Lịch"],
    ["profile", "Tôi"]
  ];
  const base = shellType === "web_app" ? "/web_app" : "/app";
  const activeKey = active === "booking" ? "bookings" : ["messages", "payments", "account"].includes(active) ? "profile" : active;
  const contentClass = active === "messages" ? "phone-content phone-content-chat" : "phone-content";
  return `
    <section class="phone ${shellType === "web_app" ? "webapp-phone" : ""}" aria-label="RentCity ${shellType}">
      ${shellType === "web_app" ? `<div class="browser-bar"><span>rentcity.vn/app</span></div>` : ""}
      <header class="phone-header">
        ${appLogo(base)}
        <button class="icon-btn" data-route="${base}/profile" aria-label="Thông báo">!</button>
      </header>
      <div class="${contentClass}">${content}</div>
      <nav class="bottom-nav">
        ${nav.map(([key, label]) => {
          const route = key === "home" ? base : `${base}/${key}`;
          return `<button class="${activeKey === key ? "active" : ""}" data-route="${route}">${label}</button>`;
        }).join("")}
      </nav>
    </section>
  `;
}

function mobileHome() {
  return `
    <span class="eyebrow">Xin chào Minh Anh</span>
    <h2 style="margin-top:8px">Tìm nhà quanh bạn</h2>
    ${searchForm(true, "/app/search")}
    <div class="grid" style="margin-top:18px">
      ${listings.slice(0, 2).map((item) => listingCard(item, "mobile")).join("")}
    </div>
  `;
}

function mobileSearch() {
  return `
    <h2>Kết quả phù hợp</h2>
    <div class="chip-row" style="margin:14px 0">
      <span class="chip">Quận 7</span><span class="chip blue">5-8tr</span><span class="chip amber">Có ban công</span>
    </div>
    ${filteredListings().map((item) => listingCard(item, "mobile")).join("")}
  `;
}

function mobileSaved() {
  const savedItems = listings.filter((item) => state.saved.includes(item.id));
  return `
    <h2>Nhà đã lưu</h2>
    <div class="grid" style="margin-top:16px">
      ${savedItems.length ? savedItems.map((item) => listingCard(item, "mobile")).join("") : emptyState("Chưa lưu nhà nào", "Bấm lưu ở một nhà phù hợp để xem lại tại đây.")}
    </div>
  `;
}

function mobileListing(id) {
  const item = listingById(id);
  return `
    <img class="card" src="${item.image}" alt="${escapeHtml(item.title)}" style="height:210px; width:100%; object-fit:cover; margin-bottom:16px" />
    <h2>${escapeHtml(item.title)}</h2>
    <p class="subtle" style="margin-top:8px">${item.district} · ${item.area}m2 · ${item.deposit}</p>
    <p class="price" style="margin-top:12px">${money(item.price)}</p>
    <div class="chip-row" style="margin-top:14px">${item.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div>
    <div class="actions" style="margin-top:18px">
      <button class="btn" data-route="/app/booking/${item.id}">Đặt lịch</button>
      <button class="btn secondary" data-save="${item.id}">${state.saved.includes(item.id) ? "Đã lưu" : "Lưu"}</button>
    </div>
  `;
}

function mobileBooking(id) {
  return phoneBookingPage(listingById(id), "/app");
}

function mobileBookings() {
  return `
    <h2>Lịch xem</h2>
    <div class="grid" style="margin-top:16px">
      ${state.bookings.map((booking) => {
        const item = listingById(booking.listingId);
        return `<article class="mobile-card"><div class="inner"><h3>${escapeHtml(item.title)}</h3><p class="subtle">${booking.date} · ${booking.time}</p><span class="chip">${booking.status}</span></div></article>`;
      }).join("")}
    </div>
  `;
}

function mobileProfile() {
  return `
    <h2>Tài khoản</h2>
    <div class="mobile-card"><div class="inner"><h3>Nguyễn Minh Anh</h3><p class="subtle">Đã xác minh số điện thoại</p></div></div>
    <div class="grid">
      <button class="card pad" data-route="/app/saved" style="text-align:left">Nhà đã lưu</button>
      <button class="card pad" data-route="/app/payments" style="text-align:left">Thanh toán & hợp đồng</button>
      <button class="card pad" data-route="/app/messages" style="text-align:left">Tin nhắn</button>
      <button class="card pad" data-route="/app/account" style="text-align:left">Bảo mật OTP</button>
    </div>
  `;
}

export function phoneBookingPage(item, baseRoute) {
  return `
    <button class="btn secondary" data-route="${baseRoute}/listing/${item.id}">Quay lại nhà</button>
    <h2 style="margin-top:16px">Đặt lịch xem nhà</h2>
    <article class="mobile-card" style="margin-top:16px">
      <img src="${item.image}" alt="${escapeHtml(item.title)}" />
      <div class="inner">
        <h3>${escapeHtml(item.title)}</h3>
        <p class="subtle">${item.district} · ${item.area}m2 · ${money(item.price)}</p>
      </div>
    </article>
    <form class="card pad" data-booking-form="${item.id}" data-success-route="${baseRoute}/payments" style="margin-top:14px">
      <label class="field"><span>Họ tên</span><input name="name" required value="Nguyễn Minh Anh" /></label>
      <label class="field" style="margin-top:12px"><span>Số điện thoại</span><input name="phone" required value="0912 345 678" /></label>
      <label class="field" style="margin-top:12px"><span>Ngày xem</span><input name="date" required value="Thứ 7, 22/06" /></label>
      <label class="field" style="margin-top:12px"><span>Khung giờ</span><select name="time"><option>09:00 - 11:00</option><option>14:30 - 16:00</option></select></label>
      <label class="field" style="margin-top:12px"><span>Ghi chú</span><textarea name="note">Mình muốn xem phòng và hỏi thêm chi phí hàng tháng.</textarea></label>
      <button class="btn" type="submit" style="width:100%; margin-top:14px">Xác nhận đặt lịch</button>
    </form>
  `;
}

export function phoneMessagesPage(baseRoute) {
  return `
    <section class="chat-screen">
      <div class="chat-head">
        <h2>Tin nhắn</h2>
        <p class="subtle">Trao đổi với chủ nhà và lưu lại lịch sử thương lượng.</p>
      </div>
      <div class="chat-list" aria-label="Danh sách tin nhắn">
        ${state.messages.map((msg) => `
        <div class="chat-bubble ${msg.from === "Bạn" ? "me" : "them"}">
          <strong>${escapeHtml(msg.from)}</strong>
          <p class="subtle">${escapeHtml(msg.body)}</p>
        </div>
      `).join("")}
      </div>
      <div class="chat-composer">
        <form class="actions" data-message-form>
          <input name="message" placeholder="Nhập tin nhắn..." />
          <button class="btn" type="submit">Gửi</button>
        </form>
        <button class="btn secondary" data-route="${baseRoute}/bookings">Xem lịch hẹn</button>
      </div>
    </section>
  `;
}

export function phonePaymentsPage(baseRoute) {
  return `
    <h2>Cọc & hợp đồng</h2>
    <div class="grid" style="margin-top:16px">
      <div class="stat"><span>Tiền cọc giữ chỗ</span><strong>5.8tr</strong><p class="subtle">Chờ xác nhận biên nhận</p></div>
      <div class="stat"><span>Hợp đồng nháp</span><strong>1</strong><p class="subtle">Sẵn sàng để xem</p></div>
      <div class="stat"><span>Lịch thanh toán</span><strong>22/06</strong><p class="subtle">Nhắc trước 2 ngày</p></div>
    </div>
    <div class="card pad" style="margin-top:16px">
      <h3>Thanh toán cọc</h3>
      <p class="subtle" style="margin-top:8px">Theo dõi tiền cọc, biên nhận và trạng thái xác nhận thanh toán.</p>
      <div class="actions" style="margin-top:14px">
        <button class="btn" data-payment="success">Đã chuyển khoản</button>
        <button class="btn secondary" data-payment="failed">Báo lỗi</button>
      </div>
      <span class="chip ${state.lastPayment === "failed" ? "red" : ""}" style="margin-top:14px">${state.lastPayment === "failed" ? "Chưa thành công" : "Sẵn sàng"}</span>
    </div>
    <button class="btn secondary" data-route="${baseRoute}/messages" style="width:100%; margin-top:12px">Nhắn chủ nhà</button>
  `;
}

export function phoneAccountPage(baseRoute) {
  return `
    <h2>Bảo mật tài khoản</h2>
    <div class="card pad" style="margin-top:16px">
      <h3>OTP & phiên đăng nhập</h3>
      <p class="subtle" style="margin-top:8px">Màn này sẽ nối OTP thật, quản lý thiết bị và đăng xuất phiên lạ khi có backend.</p>
      <button class="btn" data-account="otp" style="width:100%; margin-top:14px">Gửi mã OTP</button>
    </div>
    <div class="grid" style="margin-top:14px">
      <button class="card pad" data-route="${baseRoute}/messages" style="text-align:left">Thông báo & tin nhắn</button>
      <button class="card pad" data-route="${baseRoute}/payments" style="text-align:left">Cọc & hợp đồng</button>
    </div>
  `;
}
