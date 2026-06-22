import { assets, listingById, listings } from '../data.js';
import { state } from '../state.js';
import { filteredListings } from '../selectors.js';
import { escapeHtml, money } from '../utils.js';
import { appLogo, emptyState, listingCard, searchForm, setApp } from '../components/shared.js';
import { phoneAccountPage, phoneBookingPage, phoneMessagesPage, phonePaymentsPage } from './app.js';

export function renderWebApp(path = "dashboard", id) {
  const pages = {
    dashboard: webAppDashboard,
    search: webAppSearch,
    listing: () => webAppListing(id),
    booking: () => webAppBooking(id),
    saved: webAppSaved,
    manage: webAppManage,
    bookings: webAppBookings,
    profile: webAppProfile,
    messages: () => phoneMessagesPage("/web_app"),
    payments: () => phonePaymentsPage("/web_app"),
    account: () => phoneAccountPage("/web_app")
  };
  return setApp(`<main class="mobile-stage">${webAppShell(path, (pages[path] || webAppDashboard)())}</main>`);
}

function webAppShell(active, content) {
  const nav = [
    ["dashboard", "Home"],
    ["search", "Tìm"],
    ["manage", "Quản lý"],
    ["bookings", "Lịch"],
    ["profile", "Tôi"]
  ];
  const activeKey = active === "booking" ? "bookings" : ["saved", "messages", "payments", "account"].includes(active) ? "profile" : active;
  const contentClass = active === "messages" ? "phone-content phone-content-chat" : "phone-content";
  return `
    <section class="phone webapp-phone" aria-label="RentCity web app on phone">
      <div class="browser-bar"><span>rentcity.vn/app</span></div>
      <header class="phone-header">
        ${appLogo("/web_app")}
        <button class="icon-btn" data-route="/web_app/profile" aria-label="Thông báo">!</button>
      </header>
      <div class="${contentClass}">${content}</div>
      <nav class="bottom-nav">
        ${nav.map(([key, label]) => {
          const route = key === "dashboard" ? "/web_app" : `/web_app/${key}`;
          return `<button class="${activeKey === key ? "active" : ""}" data-route="${route}">${label}</button>`;
        }).join("")}
      </nav>
    </section>
  `;
}

function webAppDashboard() {
  return `
    <span class="eyebrow">Web app trên phone</span>
    <h2 style="margin-top:8px">RentCity PWA</h2>
    <p class="subtle" style="margin-top:8px">Dùng nhanh trên trình duyệt điện thoại: tìm nhà, đặt lịch, theo dõi cọc và quản lý nhà đang thuê.</p>
    <div class="grid" style="margin-top:18px">
      <button class="mobile-card" data-route="/web_app/search" style="text-align:left">
        <div class="inner"><h3>Tìm nhà quanh bạn</h3><p class="subtle">Bộ lọc giá, khu vực, tiện ích và bản đồ.</p></div>
      </button>
      <button class="mobile-card" data-route="/web_app/manage" style="text-align:left">
        <div class="inner"><h3>Nhà đang thuê</h3><p class="subtle">Cọc, hợp đồng, thanh toán, bảo trì.</p></div>
      </button>
      <button class="mobile-card" data-route="/web_app/bookings" style="text-align:left">
        <div class="inner"><h3>Lịch xem</h3><p class="subtle">${state.bookings.length} lịch đang theo dõi.</p></div>
      </button>
    </div>
  `;
}

function webAppSearch() {
  return `
    <h2>Tìm nhà trên web app</h2>
    ${searchForm(true, "/web_app/search")}
    <div class="grid" style="margin-top:18px">
      ${filteredListings().map((item) => `
        <article class="mobile-card">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" />
          <div class="inner">
            <h3>${escapeHtml(item.title)}</h3>
            <p class="subtle">${item.district} · ${item.area}m2</p>
            <p class="price" style="margin-top:10px">${money(item.price)}</p>
            <div class="actions" style="margin-top:14px">
              <button class="btn" data-route="/web_app/listing/${item.id}">Xem</button>
              <button class="btn secondary" data-save="${item.id}">${state.saved.includes(item.id) ? "Đã lưu" : "Lưu"}</button>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function webAppListing(id) {
  const item = listingById(id);
  return `
    <img class="card" src="${item.image}" alt="${escapeHtml(item.title)}" style="height:210px; width:100%; object-fit:cover; margin-bottom:16px" />
    <h2>${escapeHtml(item.title)}</h2>
    <p class="subtle" style="margin-top:8px">${item.address} · ${item.area}m2</p>
    <p class="price" style="margin-top:12px">${money(item.price)}</p>
    <div class="chip-row" style="margin-top:14px">${item.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div>
    <div class="actions" style="margin-top:18px">
      <button class="btn" data-route="/web_app/booking/${item.id}">Đặt lịch</button>
      <button class="btn secondary" data-save="${item.id}">${state.saved.includes(item.id) ? "Đã lưu" : "Lưu"}</button>
    </div>
  `;
}

function webAppBooking(id) {
  return phoneBookingPage(listingById(id), "/web_app");
}

function webAppSaved() {
  const savedItems = listings.filter((item) => state.saved.includes(item.id));
  return `
    <h2>Nhà đã lưu</h2>
    <div class="grid" style="margin-top:16px">
      ${savedItems.length ? savedItems.map((item) => listingCard(item, "mobile", "/web_app")).join("") : emptyState("Chưa lưu nhà nào", "Bấm lưu ở một nhà phù hợp để xem lại tại đây.")}
    </div>
  `;
}

function webAppManage() {
  return `
    <h2>Nhà đang thuê</h2>
    <div class="mobile-card" style="margin-top:16px">
      <img src="${assets.bedroom}" alt="Studio Nguyễn Văn Cừ" />
      <div class="inner">
        <h3>Studio Nguyễn Văn Cừ</h3>
        <p class="subtle">Hợp đồng 12 tháng · cọc 5.8tr · kỳ thanh toán 22/06</p>
        <div class="chip-row" style="margin-top:12px"><span class="chip">Đang thuê</span><span class="chip blue">Hợp đồng sẵn sàng</span></div>
      </div>
    </div>
    <div class="grid" style="margin-top:14px">
      <button class="card pad" data-route="/web_app/payments" style="text-align:left">Thanh toán & biên nhận</button>
      <button class="card pad" data-route="/web_app/messages" style="text-align:left">Tin nhắn chủ nhà</button>
      <button class="card pad" data-admin-action="maintenance" style="text-align:left">Gửi yêu cầu bảo trì</button>
    </div>
  `;
}

function webAppBookings() {
  return `
    <h2>Lịch xem trên web app</h2>
    <div class="grid" style="margin-top:16px">
      ${state.bookings.map((booking) => {
        const item = listingById(booking.listingId);
        return `<article class="mobile-card"><div class="inner"><h3>${escapeHtml(item.title)}</h3><p class="subtle">${booking.date} · ${booking.time}</p><span class="chip">${booking.status}</span></div></article>`;
      }).join("")}
    </div>
  `;
}

function webAppProfile() {
  return `
    <h2>Hồ sơ web app</h2>
    <div class="mobile-card" style="margin-top:16px"><div class="inner"><h3>Nguyễn Minh Anh</h3><p class="subtle">Dùng trên trình duyệt phone, dữ liệu lưu cục bộ ở máy.</p></div></div>
    <div class="grid">
      <button class="card pad" data-route="/web_app/manage" style="text-align:left">Nhà đang thuê</button>
      <button class="card pad" data-route="/web_app/saved" style="text-align:left">Nhà đã lưu</button>
      <button class="card pad" data-route="/web_app/messages" style="text-align:left">Tin nhắn</button>
      <button class="card pad" data-route="/web_app/account" style="text-align:left">Bảo mật OTP</button>
    </div>
  `;
}
