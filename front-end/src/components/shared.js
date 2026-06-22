import { assets, listings } from '../data.js';
import { state } from '../state.js';
import { escapeHtml, money } from '../utils.js';

export function appLogo(homeRoute = "/web") {
  return `
    <button class="brand" data-route="${homeRoute}" aria-label="RentCity home">
      <span class="brand-mark" aria-hidden="true"></span>
      <span>RentCity</span>
    </button>
  `;
}

export function adminLogo() {
  return `
    <button class="brand admin-brand" data-route="/admin" aria-label="RentCity Admin home">
      <span class="brand-mark" aria-hidden="true"></span>
      <span><strong>RentCity</strong><small>Admin Console</small></span>
    </button>
  `;
}

export function topbar(active = "web") {
  return `
    <header class="topbar">
      <div class="topbar-inner">
        ${appLogo("/web")}
        <nav class="nav" aria-label="RentCity sections">
          <button class="${active === "web" ? "active" : ""}" data-route="/web/search">Tìm thuê</button>
          <button data-route="/web/post">Cho thuê</button>
          <button data-route="/web/owner">Quản lý nhà</button>
          <button data-route="/web/payments">Thanh toán</button>
          <button data-route="/web/messages">Tin nhắn</button>
        </nav>
      </div>
    </header>
  `;
}

export function footer() {
  return `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <strong>RentCity</strong>
          <p class="subtle" style="margin-top:12px">Nền tảng tìm trọ, thuê nhà và quản lý bất động sản cho thuê.</p>
        </div>
        <div>
          <strong>Sản phẩm</strong>
          <button data-route="/web/search">Tìm thuê</button>
          <button data-route="/web/post">Đăng tin</button>
          <button data-route="/web/owner">Quản lý nhà</button>
        </div>
        <div>
          <strong>Công ty</strong>
          <button data-route="/web/account">Tài khoản</button>
          <button data-route="/web/messages">Tin nhắn</button>
          <button data-route="/web/payments">Thanh toán</button>
        </div>
        <div>
          <strong>Hỗ trợ</strong>
          <button data-route="/web/messages">Trợ giúp</button>
          <button data-route="/web/saved">Nhà đã lưu</button>
          <button data-route="/app">Ứng dụng mobile</button>
        </div>
      </div>
    </footer>
  `;
}

export function searchForm(compact = false, targetRoute = "/web/search") {
  return `
    <form class="search-panel" data-search-form data-target-route="${targetRoute}">
      <div class="search-grid">
        <label class="field">
          <span>Từ khóa</span>
          <input name="keyword" value="${escapeHtml(state.filters.keyword)}" placeholder="Nhập khu vực, tên đường, tiện ích" />
        </label>
        <label class="field">
          <span>Quận</span>
          <select name="district">
            ${["Tất cả", "Quận 7", "Bình Thạnh", "Thủ Đức"].map((value) => option(value, state.filters.district)).join("")}
          </select>
        </label>
        <label class="field">
          <span>Ngân sách</span>
          <select name="budget">
            ${["Tất cả", "Dưới 6tr", "6-10tr", "Trên 10tr"].map((value) => option(value, state.filters.budget)).join("")}
          </select>
        </label>
        <button class="btn" type="submit">${compact ? "Tìm" : "Tìm nhà"}</button>
      </div>
    </form>
  `;
}

function option(value, selected) {
  return `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(value)}</option>`;
}

export function listingCard(item, variant = "web", baseRoute = "/app") {
  const saved = state.saved.includes(item.id);
  if (variant === "mobile") {
    return `
      <article class="mobile-card">
        <img src="${item.image}" alt="${escapeHtml(item.title)}" />
        <div class="inner">
          <div class="listing-title">
            <h3>${escapeHtml(item.title)}</h3>
            <button class="icon-btn" data-save="${item.id}" aria-label="Lưu nhà">${saved ? "✓" : "+"}</button>
          </div>
          <p class="subtle">${item.district} · ${item.area}m2 · ${item.deposit}</p>
          <p class="price" style="margin-top:10px">${money(item.price)}</p>
          <div class="chip-row" style="margin-top:12px">
            ${item.tags.slice(0, 2).map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}
          </div>
          <div class="actions" style="margin-top:14px">
            <button class="btn" data-route="${baseRoute}/listing/${item.id}">Xem</button>
            <button class="btn secondary" data-save="${item.id}">${saved ? "Đã lưu" : "Lưu"}</button>
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="card listing-card">
      <img src="${item.image}" alt="${escapeHtml(item.title)}" />
      <div>
        <div class="listing-title">
          <h3>${escapeHtml(item.title)}</h3>
          <span class="price">${money(item.price)}</span>
        </div>
        <p class="subtle" style="margin-top:8px">${item.address} · ${item.district} · ${item.area}m2</p>
        <div class="chip-row" style="margin-top:14px">
          <span class="chip">${item.rooms} phòng ngủ</span>
          <span class="chip blue">${item.deposit}</span>
          <span class="chip amber">${item.electricity}</span>
        </div>
      </div>
      <div class="actions" style="align-content:start; justify-content:flex-end">
        <button class="icon-btn" data-save="${item.id}" aria-label="Lưu nhà">${saved ? "✓" : "+"}</button>
        <button class="btn" data-route="/web/listing/${item.id}">Chi tiết</button>
      </div>
    </article>
  `;
}

export function mapPanel() {
  return `
    <aside class="card map-card">
      <div class="listing-title">
        <h3>Bản đồ khu vực</h3>
        <span class="chip blue">Bản đồ khu vực</span>
      </div>
      <div class="map-art" style="margin-top:16px">
        <span class="road" style="left:34px; top:70px; width:82%; height:7px"></span>
        <span class="road" style="left:72px; top:148px; width:70%; height:7px"></span>
        <span class="road" style="left:38px; top:226px; width:78%; height:7px"></span>
        <span class="road" style="left:150px; top:34px; width:7px; height:250px"></span>
        <span class="road" style="left:276px; top:64px; width:7px; height:220px"></span>
        <button class="pin" style="left:118px; top:172px" data-route="/web/listing/studio-q7" aria-label="Studio mới"></button>
        <button class="pin blue" style="left:262px; top:128px" data-route="/web/listing/can-ho-1pn" aria-label="Căn hộ 1PN"></button>
        <button class="pin amber" style="left:76px; top:230px" data-route="/web/listing/phong-tro-an-ninh" aria-label="Phòng trọ"></button>
      </div>
      <div class="grid" style="margin-top:16px">
        ${listings.slice(0, 3).map((item) => `
          <button class="card pad" data-route="/web/listing/${item.id}" style="text-align:left">
            <strong>${escapeHtml(item.title)}</strong>
            <p class="subtle">${item.district} · ${money(item.price)}</p>
          </button>
        `).join("")}
      </div>
    </aside>
  `;
}

let toastTimer = null;

export function emptyState(title, body) {
  return `<div class="empty-state"><div><h3>${title}</h3><p>${body}</p></div></div>`;
}

export function setApp(html) {
  document.getElementById("app").innerHTML = html + `<div class="toast" id="toast" role="status"></div>`;
  setTimeout(() => {
    const chatList = document.querySelector?.(".chat-list");
    if (chatList) chatList.scrollTop = chatList.scrollHeight;
  }, 0);
}

export function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}
