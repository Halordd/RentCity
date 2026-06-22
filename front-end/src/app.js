const assets = {
  apartment: "/.rentcity-assets/rentcity-apartment.jpg",
  bedroom: "/.rentcity-assets/rentcity-bedroom.jpg",
  building: "/.rentcity-assets/rentcity-building.jpg",
  house: "/.rentcity-assets/rentcity-house.jpg",
  livingroom: "/.rentcity-assets/rentcity-livingroom.jpg"
};

const listings = [
  {
    id: "studio-q7",
    title: "Studio mới gần Crescent Mall",
    district: "Quận 7",
    address: "Nguyễn Văn Cừ, Tân Phong",
    price: 5.8,
    area: 28,
    rooms: 1,
    wc: 1,
    floor: "Tầng 5",
    deposit: "Cọc 1 tháng",
    electricity: "4k/kWh",
    water: "100k/người",
    parking: "150k/tháng",
    tags: ["Ban công", "Full nội thất", "Máy giặt riêng"],
    image: assets.bedroom,
    owner: "Anh Minh Nguyễn",
    verified: true,
    available: "22/06",
    score: 92,
    coordinates: "10.729, 106.721"
  },
  {
    id: "can-ho-1pn",
    title: "Căn hộ 1PN Sunrise City",
    district: "Quận 7",
    address: "Nguyễn Hữu Thọ, Tân Hưng",
    price: 8.2,
    area: 42,
    rooms: 1,
    wc: 1,
    floor: "Tầng 12",
    deposit: "Cọc 2 tháng",
    electricity: "Theo nhà nước",
    water: "18k/m3",
    parking: "Miễn phí 1 xe",
    tags: ["Hồ bơi", "Thang máy", "Bảo vệ 24/7"],
    image: assets.apartment,
    owner: "Cô Thảo Lê",
    verified: true,
    available: "24/06",
    score: 88,
    coordinates: "10.737, 106.701"
  },
  {
    id: "phong-tro-an-ninh",
    title: "Phòng trọ an ninh Huỳnh Tấn Phát",
    district: "Quận 7",
    address: "Huỳnh Tấn Phát, Phú Thuận",
    price: 4.2,
    area: 24,
    rooms: 1,
    wc: 1,
    floor: "Tầng 2",
    deposit: "Cọc 1 tháng",
    electricity: "4.2k/kWh",
    water: "80k/người",
    parking: "100k/tháng",
    tags: ["Giờ tự do", "Camera", "Gác lửng"],
    image: assets.livingroom,
    owner: "Chị Hạnh Võ",
    verified: true,
    available: "20/06",
    score: 84,
    coordinates: "10.746, 106.732"
  },
  {
    id: "nha-thu-duc",
    title: "Nhà nguyên căn Thảo Điền",
    district: "Thủ Đức",
    address: "Quốc Hương, Thảo Điền",
    price: 15,
    area: 76,
    rooms: 2,
    wc: 2,
    floor: "Trệt + lầu",
    deposit: "Cọc 2 tháng",
    electricity: "Theo nhà nước",
    water: "Theo nhà nước",
    parking: "Sân riêng",
    tags: ["Nuôi pet", "Sân nhỏ", "Bếp riêng"],
    image: assets.house,
    owner: "Anh Quốc Bảo",
    verified: true,
    available: "25/06",
    score: 91,
    coordinates: "10.806, 106.733"
  },
  {
    id: "toa-nha-binh-thanh",
    title: "Căn hộ dịch vụ Bình Thạnh",
    district: "Bình Thạnh",
    address: "Nguyễn Gia Trí, Phường 25",
    price: 7.4,
    area: 35,
    rooms: 1,
    wc: 1,
    floor: "Tầng 7",
    deposit: "Cọc 1.5 tháng",
    electricity: "4k/kWh",
    water: "120k/người",
    parking: "200k/tháng",
    tags: ["Dọn phòng", "Cửa sổ lớn", "Thang máy"],
    image: assets.building,
    owner: "RentCity Homes",
    verified: true,
    available: "26/06",
    score: 87,
    coordinates: "10.802, 106.714"
  }
];

const adminRows = {
  listings: [
    ["Studio mới gần Crescent Mall", "Đã duyệt", "5.8tr", "92/100"],
    ["Căn hộ 1PN Sunrise City", "Đang chạy", "8.2tr", "88/100"],
    ["Nhà nguyên căn Thảo Điền", "Cần ảnh mặt tiền", "15tr", "74/100"],
    ["Căn hộ dịch vụ Bình Thạnh", "Đợi xác minh", "7.4tr", "80/100"]
  ],
  verification: [
    ["Anh Minh Nguyễn", "CMND/CCCD", "Đã tải lên", "Duyệt"],
    ["Cô Thảo Lê", "Giấy sở hữu", "Cần kiểm tra", "Yêu cầu bổ sung"],
    ["RentCity Homes", "Tài khoản nhận cọc", "Hợp lệ", "Duyệt"],
    ["Anh Quốc Bảo", "Ảnh nhà thật", "Thiếu ảnh", "Tạm giữ"]
  ],
  disputes: [
    ["DSP-102", "Hoàn tiền cọc", "2 giờ", "Đang xử lý"],
    ["DSP-101", "Ảnh không đúng", "5 giờ", "Chờ chủ nhà"],
    ["DSP-099", "Không phản hồi", "1 ngày", "Theo dõi"],
    ["DSP-097", "Phí phát sinh", "2 ngày", "Đề xuất đóng"]
  ]
};

const storeKey = "rentcity.production.state";
let state = loadState();
let toastTimer = null;

function loadState() {
  const fallback = {
    filters: { keyword: "", district: "Tất cả", budget: "Tất cả" },
    saved: ["studio-q7"],
    bookings: [
      { id: "BK-2606", listingId: "studio-q7", date: "Thứ 7, 22/06", time: "09:00 - 11:00", status: "Đã xác nhận" }
    ],
    messages: [
      { from: "Chủ nhà", body: "Mình còn lịch xem 09:00 sáng thứ 7, bạn xác nhận giúp nhé." },
      { from: "Bạn", body: "Dạ được, cho mình xin thêm phí gửi xe và tiền điện." }
    ],
    notifications: ["Lịch xem Studio Nguyễn Văn Cừ đã được xác nhận.", "Có 5 tin mới quanh Quận 7."],
    activeAdmin: "overview"
  };

  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(storeKey) || "{}") };
  } catch {
    return fallback;
  }
}

function persist() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function money(value) {
  return `${value.toLocaleString("vi-VN")}tr/tháng`;
}

function listingById(id) {
  return listings.find((item) => item.id === id) || listings[0];
}

function normalizeRoutePath(path) {
  const raw = `${path || "/web"}`.replace(/^#\/?/, "/");
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function routeTo(path) {
  const nextPath = normalizeRoutePath(path);
  window.history.pushState({}, "", nextPath);
  render();
  window.scrollTo?.(0, 0);
}

function routeParts() {
  const hashRoute = window.location.hash.replace(/^#\/?/, "");
  const pathRoute = window.location.pathname.replace(/^\/+|\/+$/g, "");
  const raw = hashRoute || pathRoute;
  return raw ? raw.split("/") : ["web"];
}

function filteredListings() {
  const keyword = state.filters.keyword.trim().toLowerCase();
  return listings.filter((item) => {
    const districtOk = state.filters.district === "Tất cả" || item.district === state.filters.district;
    const budgetOk =
      state.filters.budget === "Tất cả" ||
      (state.filters.budget === "Dưới 6tr" && item.price < 6) ||
      (state.filters.budget === "6-10tr" && item.price >= 6 && item.price <= 10) ||
      (state.filters.budget === "Trên 10tr" && item.price > 10);
    const keywordOk =
      !keyword ||
      `${item.title} ${item.district} ${item.address} ${item.tags.join(" ")}`.toLowerCase().includes(keyword);
    return districtOk && budgetOk && keywordOk;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function appLogo(homeRoute = "/web") {
  return `
    <button class="brand" data-route="${homeRoute}" aria-label="RentCity home">
      <span class="brand-mark" aria-hidden="true"></span>
      <span>RentCity</span>
    </button>
  `;
}

function adminLogo() {
  return `
    <button class="brand admin-brand" data-route="/admin" aria-label="RentCity Admin home">
      <span class="brand-mark" aria-hidden="true"></span>
      <span><strong>RentCity</strong><small>Admin Console</small></span>
    </button>
  `;
}

function topbar(active = "web") {
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

function footer() {
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

function searchForm(compact = false, targetRoute = "/web/search") {
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

function listingCard(item, variant = "web", baseRoute = "/app") {
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

function mapPanel() {
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

function renderWeb(path = "home", id) {
  if (path === "search") return setApp(topbar("web") + webSearchPage() + footer());
  if (path === "listing") return setApp(topbar("web") + webDetailPage(id) + footer());
  if (path === "booking") return setApp(topbar("web") + bookingPage(id) + footer());
  if (path === "saved") return setApp(topbar("web") + savedPage() + footer());
  if (path === "messages") return setApp(topbar("web") + messagesPage() + footer());
  if (path === "payments") return setApp(topbar("web") + paymentsPage() + footer());
  if (path === "owner") return setApp(topbar("web") + ownerPage() + footer());
  if (path === "post") return setApp(topbar("web") + postPage() + footer());
  if (path === "account") return setApp(topbar("web") + accountPage() + footer());
  return setApp(topbar("web") + webHomePage() + footer());
}

function webHomePage() {
  return `
    <main class="page">
      <section class="hero">
        <div>
          <span class="eyebrow">Nhà thật, lịch thật, quản lý thật</span>
          <h1>RentCity</h1>
          <p class="lead">Tìm trọ, thuê căn hộ và quản lý nhà cho thuê trong một sản phẩm thống nhất: ảnh thật, lịch xem, cọc, hợp đồng, tin nhắn và vận hành chủ nhà.</p>
          ${searchForm()}
          <div class="metric-row" style="margin-top:18px">
            <span class="chip">+42 nhà đã xác minh</span>
            <span class="chip blue">84% lịch xem xác nhận</span>
            <span class="chip amber">12 phút phản hồi trung bình</span>
          </div>
        </div>
        <article class="media-card">
          <img src="${assets.house}" alt="Nhà cho thuê thực tế" />
          <div class="media-card-body">
            <h3>Nhà nguyên căn Thảo Điền</h3>
            <p class="subtle" style="margin-top:8px">2 phòng ngủ · nuôi pet · có sân nhỏ</p>
            <p class="price" style="margin-top:14px">15tr/tháng</p>
          </div>
        </article>
      </section>
      <section class="section">
        <div class="section-head">
          <div>
            <span class="eyebrow">Khám phá nhanh</span>
            <h2>Nhà nổi bật quanh khu vực</h2>
          </div>
          <button class="btn secondary" data-route="/web/search">Xem tất cả</button>
        </div>
        <div class="grid cols-3">
          ${listings.slice(0, 3).map((item) => listingTile(item)).join("")}
        </div>
      </section>
      <section class="section grid cols-3">
        ${[
          ["Tìm thuê", "Bộ lọc giá, quận, tiện ích, bản đồ và so sánh chi phí trước khi liên hệ."],
          ["Ký thuê", "Đặt lịch, nhắn chủ nhà, thanh toán cọc và theo dõi hợp đồng."],
          ["Quản lý", "Dashboard chủ nhà, lịch xem, tin nhắn, cọc, hợp đồng và báo cáo doanh thu."]
        ].map(([title, body]) => `
          <article class="card pad">
            <span class="chip">${title}</span>
            <h3 style="margin-top:16px">${title}</h3>
            <p class="subtle" style="margin-top:10px">${body}</p>
          </article>
        `).join("")}
      </section>
    </main>
  `;
}

function listingTile(item) {
  return `
    <article class="card">
      <img src="${item.image}" alt="${escapeHtml(item.title)}" style="height:190px; width:100%; object-fit:cover" />
      <div class="pad">
        <h3>${escapeHtml(item.title)}</h3>
        <p class="subtle" style="margin-top:8px">${item.district} · ${item.area}m2</p>
        <p class="price" style="margin-top:12px">${money(item.price)}</p>
        <div class="actions" style="margin-top:14px">
          <button class="btn" data-route="/web/listing/${item.id}">Xem chi tiết</button>
          <button class="btn secondary" data-save="${item.id}">${state.saved.includes(item.id) ? "Đã lưu" : "Lưu"}</button>
        </div>
      </div>
    </article>
  `;
}

function webSearchPage() {
  const results = filteredListings();
  return `
    <main class="page">
      <span class="eyebrow">Tìm thuê</span>
      <h1 style="font-size:44px">Chọn nhà đúng nhu cầu</h1>
      ${searchForm(true)}
      <div class="split section" style="padding-top:28px">
        <section class="grid">
          <div class="section-head" style="margin-bottom:0">
            <p class="subtle">${results.length} kết quả phù hợp bộ lọc hiện tại</p>
            <button class="btn secondary" data-route="/web/saved">Nhà đã lưu</button>
          </div>
          ${results.length ? results.map((item) => listingCard(item)).join("") : emptyState("Chưa có nhà phù hợp", "Thử nới ngân sách hoặc chọn quận khác.")}
        </section>
        ${mapPanel()}
      </div>
    </main>
  `;
}

function webDetailPage(id) {
  const item = listingById(id);
  return `
    <main class="page">
      <button class="btn secondary" data-route="/web/search">Quay lại kết quả</button>
      <section class="section split" style="padding-top:22px">
        <div>
          <div class="grid cols-2">
            <img class="card" src="${item.image}" alt="${escapeHtml(item.title)}" style="height:360px; width:100%; object-fit:cover" />
            <div class="grid">
              <img class="card" src="${assets.livingroom}" alt="Phòng khách" style="height:171px; width:100%; object-fit:cover" />
              <img class="card" src="${assets.building}" alt="Tòa nhà" style="height:171px; width:100%; object-fit:cover" />
            </div>
          </div>
          <div class="section-head" style="margin-top:28px">
            <div>
              <span class="eyebrow">${item.verified ? "Đã xác minh" : "Chờ xác minh"}</span>
              <h1 style="font-size:46px">${escapeHtml(item.title)}</h1>
              <p class="lead" style="font-size:17px">${item.address} · ${item.district}</p>
            </div>
            <p class="price">${money(item.price)}</p>
          </div>
          <div class="grid cols-3">
            ${[
              [`${item.area}m2`, "Diện tích"],
              [item.rooms, "Phòng ngủ"],
              [item.wc, "WC"],
              [item.floor, "Vị trí"]
            ].map(([value, label]) => `<div class="stat"><span class="subtle">${label}</span><strong>${value}</strong></div>`).join("")}
          </div>
          <section class="section">
            <h2>Mô tả</h2>
            <p class="lead" style="font-size:17px">Nhà đã được RentCity kiểm tra ảnh thật, vị trí và chi phí chính. Phù hợp người đi làm hoặc sinh viên cần không gian riêng, di chuyển nhanh tới khu trung tâm.</p>
          </section>
          <section class="section">
            <h2>Tiện ích và chi phí</h2>
            <div class="grid cols-3" style="margin-top:18px">
              ${[...item.tags, item.deposit, item.electricity, item.water, item.parking].map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </section>
        </div>
        <aside class="grid" style="align-self:start">
          <div class="card pad">
            <h3>Đặt lịch xem nhà</h3>
            <label class="field" style="margin-top:16px"><span>Ngày xem</span><input value="Thứ 7, 22/06" /></label>
            <label class="field" style="margin-top:12px"><span>Khung giờ</span><select><option>09:00 - 11:00</option><option>14:30 - 16:00</option><option>17:00 - 18:30</option></select></label>
            <button class="btn" style="width:100%; margin-top:16px" data-route="/web/booking/${item.id}">Đặt lịch</button>
            <button class="btn secondary" style="width:100%; margin-top:10px" data-route="/web/messages">Nhắn chủ nhà</button>
          </div>
          <div class="card pad">
            <h3>${escapeHtml(item.owner)}</h3>
            <p class="subtle" style="margin-top:8px">Đã xác thực · ${item.score}/100 điểm tin cậy</p>
            <div class="actions" style="margin-top:14px">
              <button class="btn secondary" data-save="${item.id}">${state.saved.includes(item.id) ? "Đã lưu" : "Lưu nhà"}</button>
              <button class="btn secondary" data-route="/web/messages">Chat</button>
            </div>
          </div>
          ${mapPanel()}
        </aside>
      </section>
    </main>
  `;
}

function bookingPage(id) {
  const item = listingById(id);
  return `
    <main class="page">
      <span class="eyebrow">Booking</span>
      <h1 style="font-size:44px">Hoàn tất đặt lịch xem</h1>
      <section class="section split" style="padding-top:24px">
        <form class="card pad" data-booking-form="${item.id}">
          <h3>Thông tin lịch hẹn</h3>
          <div class="grid cols-2" style="margin-top:18px">
            <label class="field"><span>Họ tên</span><input name="name" required value="Nguyễn Minh Anh" /></label>
            <label class="field"><span>Số điện thoại</span><input name="phone" required value="0912 345 678" /></label>
            <label class="field"><span>Ngày xem</span><input name="date" required value="Thứ 7, 22/06" /></label>
            <label class="field"><span>Khung giờ</span><select name="time"><option>09:00 - 11:00</option><option>14:30 - 16:00</option></select></label>
          </div>
          <label class="field" style="margin-top:14px"><span>Ghi chú</span><textarea name="note">Mình muốn xem phòng, hỏi thêm tiền điện nước và chỗ gửi xe.</textarea></label>
          <div class="actions" style="margin-top:18px">
            <button class="btn" type="submit">Xác nhận đặt lịch</button>
            <button class="btn secondary" type="button" data-route="/web/listing/${item.id}">Xem lại nhà</button>
          </div>
        </form>
        <aside class="card">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" style="height:220px; width:100%; object-fit:cover" />
          <div class="pad">
            <h3>${escapeHtml(item.title)}</h3>
            <p class="subtle" style="margin-top:8px">${item.address}</p>
            <p class="price" style="margin-top:12px">${money(item.price)}</p>
            <span class="chip amber" style="margin-top:12px">${item.deposit}</span>
          </div>
        </aside>
      </section>
    </main>
  `;
}

function savedPage() {
  const savedItems = listings.filter((item) => state.saved.includes(item.id));
  return `
    <main class="page">
      <span class="eyebrow">Wishlist</span>
      <h1 style="font-size:44px">Nhà đã lưu</h1>
      <section class="section grid">
        ${savedItems.length ? savedItems.map((item) => listingCard(item)).join("") : emptyState("Bạn chưa lưu nhà nào", "Khi thấy nhà phù hợp, bấm lưu để so sánh sau.")}
      </section>
    </main>
  `;
}

function messagesPage() {
  return `
    <main class="page">
      <span class="eyebrow">Tin nhắn</span>
      <h1 style="font-size:44px">Trao đổi và thương lượng</h1>
      <section class="section split" style="grid-template-columns:320px minmax(0,1fr)">
        <aside class="grid">
          ${listings.slice(0, 4).map((item, index) => `
            <button class="card pad" style="text-align:left" data-route="/web/messages">
              <strong>${escapeHtml(item.owner)}</strong>
              <p class="subtle">${item.title}</p>
              <span class="chip ${index === 0 ? "" : "blue"}">${index === 0 ? "Đang trao đổi" : "Đã xem"}</span>
            </button>
          `).join("")}
        </aside>
        <section class="card pad">
          <h3>Studio Nguyễn Văn Cừ</h3>
          <div class="grid" style="margin:20px 0">
            ${state.messages.map((msg) => `
              <div class="card pad" style="max-width:70%; ${msg.from === "Bạn" ? "margin-left:auto; background:#e8f5f3" : ""}">
                <strong>${msg.from}</strong>
                <p class="subtle">${escapeHtml(msg.body)}</p>
              </div>
            `).join("")}
          </div>
          <form class="actions" data-message-form>
            <input name="message" placeholder="Nhập tin nhắn..." style="flex:1; min-height:44px; border:1px solid var(--line); border-radius:8px; padding:0 14px" />
            <button class="btn" type="submit">Gửi</button>
          </form>
        </section>
      </section>
    </main>
  `;
}

function paymentsPage() {
  return `
    <main class="page">
      <span class="eyebrow">Thanh toán</span>
      <h1 style="font-size:44px">Cọc và hợp đồng</h1>
      <section class="section grid cols-3">
        <div class="stat"><span>Tiền cọc giữ chỗ</span><strong>5.8tr</strong><p class="subtle">Chờ xác nhận biên nhận</p></div>
        <div class="stat"><span>Hợp đồng nháp</span><strong>1</strong><p class="subtle">Sẵn sàng để xem</p></div>
        <div class="stat"><span>Lịch thanh toán</span><strong>22/06</strong><p class="subtle">Nhắc trước 2 ngày</p></div>
      </section>
      <section class="section split">
        <div class="card pad">
          <h3>Thanh toán cọc</h3>
          <p class="subtle" style="margin-top:8px">Theo dõi tiền cọc, biên nhận và trạng thái xác nhận thanh toán.</p>
          <div class="actions" style="margin-top:18px">
            <button class="btn" data-payment="success">Xác nhận đã chuyển khoản</button>
            <button class="btn secondary" data-payment="failed">Mô phỏng lỗi</button>
          </div>
        </div>
        <div class="card pad">
          <h3>Biên nhận gần nhất</h3>
          <p class="subtle" style="margin-top:8px">Mã RC-DEP-2606 · Studio Nguyễn Văn Cừ</p>
          <span class="chip ${state.lastPayment === "failed" ? "red" : ""}" style="margin-top:14px">${state.lastPayment === "failed" ? "Chưa thành công" : "Sẵn sàng"}</span>
        </div>
      </section>
    </main>
  `;
}

function ownerPage() {
  return `
    <main class="page">
      <span class="eyebrow">Chủ nhà</span>
      <h1 style="font-size:44px">Quản lý danh mục cho thuê</h1>
      <section class="section stat-grid">
        <div class="stat"><span>Nhà đang quản lý</span><strong>12</strong><p class="subtle">8 tin đang hiển thị</p></div>
        <div class="stat"><span>Lịch xem tuần này</span><strong>24</strong><p class="subtle">84% xác nhận</p></div>
        <div class="stat"><span>Doanh thu tháng</span><strong>128tr</strong><p class="subtle">+18% so với tháng trước</p></div>
        <div class="stat"><span>Cần xử lý</span><strong>6</strong><p class="subtle">Hồ sơ và tin nhắn</p></div>
      </section>
      <section class="section grid cols-2">
        <div class="card pad">
          <h3>Pipeline khách thuê</h3>
          <div class="workflow" style="margin-top:16px">
            ${["Mới liên hệ", "Đặt lịch xem", "Đang thương lượng", "Chờ hợp đồng"].map((step, index) => `
              <div class="workflow-step"><span class="num">${index + 1}</span><div><strong>${step}</strong><p class="subtle">${[8, 5, 3, 2][index]} khách</p></div></div>
            `).join("")}
          </div>
        </div>
        <div class="card pad">
          <h3>Công cụ chủ nhà đang bật</h3>
          <p class="subtle" style="margin-top:8px">Theo dõi lịch xem, phản hồi khách thuê, nhắc cọc và chuẩn bị hợp đồng cho nhà đang quản lý.</p>
          <div class="actions" style="margin-top:18px">
            <button class="btn" data-route="/web/messages">Xem trao đổi</button>
            <button class="btn secondary" data-route="/web/post">Đăng tin mới</button>
          </div>
        </div>
      </section>
    </main>
  `;
}

function postPage() {
  return `
    <main class="page">
      <span class="eyebrow">Đăng tin</span>
      <h1 style="font-size:44px">Đăng nhà cho thuê</h1>
      <form class="section card pad" data-post-form>
        <div class="grid cols-2">
          <label class="field"><span>Tên nhà</span><input name="title" required placeholder="Ví dụ: Studio mới gần Crescent Mall" /></label>
          <label class="field"><span>Giá thuê</span><input name="price" required placeholder="5.8tr/tháng" /></label>
          <label class="field"><span>Quận</span><select name="district"><option>Quận 7</option><option>Bình Thạnh</option><option>Thủ Đức</option></select></label>
          <label class="field"><span>Diện tích</span><input name="area" required placeholder="28m2" /></label>
        </div>
        <label class="field" style="margin-top:14px"><span>Mô tả</span><textarea placeholder="Nội thất, cọc, điện nước, lịch trống..."></textarea></label>
        <div class="actions" style="margin-top:18px">
          <button class="btn" type="submit">Lưu tin nháp</button>
          <button class="btn secondary" type="button" data-route="/web/owner">Quản lý tin</button>
        </div>
      </form>
    </main>
  `;
}

function accountPage() {
  return `
    <main class="page">
      <span class="eyebrow">Tài khoản</span>
      <h1 style="font-size:44px">Thông tin cá nhân</h1>
      <section class="section grid cols-2">
        <div class="card pad">
          <h3>Đăng nhập OTP</h3>
          <label class="field" style="margin-top:16px"><span>Số điện thoại</span><input value="+84 912 345 678" /></label>
          <div class="actions" style="margin-top:18px">
            <button class="btn" data-account="otp">Gửi mã OTP</button>
            <button class="btn secondary" data-route="/web/saved">Xem nhà đã lưu</button>
          </div>
        </div>
        <div class="card pad">
          <h3>Thông báo</h3>
          <div class="grid" style="margin-top:14px">
            ${state.notifications.map((item) => `<p class="card pad subtle">${escapeHtml(item)}</p>`).join("")}
          </div>
        </div>
      </section>
    </main>
  `;
}

function adminChrome(active, content) {
  const items = [
    ["overview", "Command Center"],
    ["listings", "Kiểm duyệt tin"],
    ["verification", "KYC chủ nhà"],
    ["automation", "Quy tắc hệ thống"],
    ["billing", "Tài chính"],
    ["disputes", "Khiếu nại"],
    ["audit", "Audit logs"],
    ["access", "Phân quyền"],
    ["settings", "Cài đặt"]
  ];
  return `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        ${adminLogo()}
        <nav class="admin-nav">
          ${items.map(([key, label]) => `<button class="${active === key ? "active" : ""}" data-route="/admin/${key}">${label}</button>`).join("")}
        </nav>
      </aside>
      <main class="admin-main">
        ${content}
      </main>
    </div>
  `;
}

function renderAdmin(path = "overview") {
  const active = path || "overview";
  const pages = {
    overview: adminOverview,
    listings: adminListings,
    verification: adminVerification,
    automation: adminAutomation,
    billing: adminBilling,
    disputes: adminDisputes,
    audit: adminAudit,
    access: adminAccess,
    settings: adminSettings
  };
  return setApp(adminChrome(active, (pages[active] || adminOverview)()));
}

function adminHeader(title, body) {
  return `
    <div class="admin-top">
      <div>
        <span class="eyebrow">RentCity admin</span>
        <h1 style="font-size:44px">${title}</h1>
        <p class="subtle">${body}</p>
      </div>
      <div class="actions">
        <button class="btn secondary" data-route="/admin/audit">Audit log</button>
        <button class="btn" data-route="/admin/access">Phân quyền</button>
      </div>
    </div>
  `;
}

function adminOverview() {
  return `
    ${adminHeader("Admin Command Center", "Back-office cho kiểm duyệt, rủi ro, phân quyền, đối soát và audit toàn hệ thống.")} 
    <section class="stat-grid">
      <div class="stat"><span>Hồ sơ KYC chờ duyệt</span><strong>11</strong><p class="subtle">SLA còn 4 giờ</p></div>
      <div class="stat"><span>Tin cần QA</span><strong>23</strong><p class="subtle">Ảnh thật, giá, địa chỉ</p></div>
      <div class="stat"><span>Dispute quá hạn</span><strong>3</strong><p class="subtle">Ưu tiên xử lý hôm nay</p></div>
      <div class="stat"><span>Cảnh báo quyền</span><strong>2</strong><p class="subtle">Role thay đổi bất thường</p></div>
    </section>
    <section class="section grid cols-2">
      <div class="card pad">
        <h3>Hàng đợi kiểm soát</h3>
        <div class="workflow" style="margin-top:16px">
          ${["KYC chủ nhà", "QA ảnh thật", "Duyệt hoàn cọc", "Audit role", "Feature flags"].map((item, index) => `
            <div class="workflow-step"><span class="num">${index + 1}</span><div><strong>${item}</strong><p class="subtle">Back-office xử lý</p></div></div>
          `).join("")}
        </div>
      </div>
      <div class="card pad">
        <h3>Tác vụ hôm nay</h3>
        ${table(["Tác vụ", "Ưu tiên", "SLA"], [["Duyệt 11 hồ sơ KYC", "Cao", "4h"], ["Khóa 2 tin nghi rủi ro", "Cao", "2h"], ["Kiểm tra 3 khiếu nại", "Cao", "2h"], ["Đối soát 8 giao dịch", "Trung bình", "1d"]])}
      </div>
    </section>
  `;
}

function adminListings() {
  return `${adminHeader("Kiểm duyệt tin đăng", "Hàng đợi QA độc lập với Owner Center: kiểm tra ảnh thật, giá, giấy tờ, tọa độ và dấu hiệu rủi ro trước khi public.")}${tableSection("Hàng đợi QA", ["Tin đăng", "Trạng thái kiểm duyệt", "Giá", "Điểm rủi ro"], adminRows.listings)}${adminActionPanel("Bộ quy tắc QA", "Admin có thể giữ tin, yêu cầu bổ sung ảnh thật, khóa tin hoặc chuyển sang dispute nếu phát hiện bất thường.", "Mở hàng đợi QA")}`;
}

function adminVerification() {
  return `${adminHeader("Duyệt xác minh", "Kiểm tra giấy tờ, tài khoản nhận cọc và ảnh nhà trước khi mở quyền đăng tin.")}${tableSection("Hồ sơ chờ duyệt", ["Chủ nhà", "Hạng mục", "Tình trạng", "Hành động"], adminRows.verification)}${adminActionPanel("Điểm tin cậy dự kiến", "Hồ sơ Minh Nguyễn đạt 92/100 sau khi đối chiếu địa chỉ và ảnh thật.", "Duyệt hồ sơ")}`;
}

function adminAutomation() {
  return `
    ${adminHeader("Quy tắc hệ thống", "Cấu hình automation cấp nền tảng: SLA, cảnh báo rủi ro, notification template và escalation cho support.")}
    <section class="grid cols-2">
      <div class="card pad">
        <h3>Khi phát sinh sự kiện nhạy cảm</h3>
        <div class="workflow" style="margin-top:16px">
          ${["Ghi audit log", "Chạy rule rủi ro", "Gửi cảnh báo support", "Escalate nếu quá SLA"].map((step, index) => `<div class="workflow-step"><span class="num">${index + 1}</span><div><strong>${step}</strong><p class="subtle">Quy tắc hệ thống</p></div></div>`).join("")}
        </div>
        <div class="actions" style="margin-top:18px"><button class="btn" data-admin-action="automation">Lưu quy tắc</button><button class="btn secondary">Chạy thử</button></div>
      </div>
      <div class="card pad">
        <h3>Độ ổn định 7 ngày</h3>
        <div class="stat-grid" style="grid-template-columns:1fr 1fr; margin-top:16px">
          <div class="stat"><span>Rule chạy đúng</span><strong>99.1%</strong></div>
          <div class="stat"><span>Escalation</span><strong>18</strong></div>
          <div class="stat"><span>False positive</span><strong>4</strong></div>
          <div class="stat"><span>Webhook lỗi</span><strong>2</strong></div>
        </div>
      </div>
    </section>
  `;
}

function adminBilling() {
  return `${adminHeader("Tài chính & đối soát", "Back-office cho cọc, hoàn tiền, hóa đơn, subscription chủ nhà và giao dịch cần kiểm tra.")}${tableSection("Giao dịch cần đối soát", ["Mã", "Ngày", "Số tiền", "Trạng thái"], [["DEP-2606", "18/06", "5.800.000đ", "Chờ đối soát"], ["REF-102", "18/06", "2.000.000đ", "Cần duyệt hoàn"], ["INV-0526", "18/05", "1.990.000đ", "Đã xuất hóa đơn"]])}${adminActionPanel("Cổng thanh toán", "Kiểm tra webhook, biên nhận, mã giao dịch ngân hàng và quyền duyệt hoàn tiền.", "Kiểm tra kết nối")}`;
}

function adminDisputes() {
  return `${adminHeader("Trung tâm khiếu nại", "Xử lý hoàn cọc, ảnh sai, chủ nhà không phản hồi và phí phát sinh.")}${tableSection("Hộp thư khiếu nại", ["Mã", "Loại", "SLA", "Trạng thái"], adminRows.disputes)}${adminActionPanel("DSP-102 - Hoàn tiền cọc", "Khách báo chủ nhà hủy lịch sau khi đã nhận cọc giữ chỗ. Cần kiểm tra biên nhận và tin nhắn.", "Hoàn tiền")}`;
}

function adminAudit() {
  return `
    ${adminHeader("Audit logs", "Theo dõi hành động nhạy cảm: duyệt KYC, khóa tin, hoàn tiền, export dữ liệu và thay đổi phân quyền.")}
    ${tableSection("Nhật ký hệ thống", ["Thời gian", "Người thao tác", "Hành động", "Kết quả"], [
      ["20/06 09:42", "Verifier Lan", "Duyệt KYC Anh Minh Nguyễn", "Thành công"],
      ["20/06 09:18", "Support Nam", "Yêu cầu bổ sung ảnh mặt tiền", "Đã gửi"],
      ["19/06 17:06", "Accountant Hân", "Duyệt hoàn tiền DSP-102", "Chờ cấp cao"],
      ["19/06 15:33", "Super Admin", "Thay đổi role support", "Đã ghi log"]
    ])}
    ${adminActionPanel("Xuất audit", "Chỉ super admin được export log nhạy cảm theo khoảng thời gian và role.", "Xuất CSV")}
  `;
}

function adminAccess() {
  return `
    ${adminHeader("Phân quyền & bảo mật", "Quản trị role nội bộ, MFA, phiên đăng nhập, quyền duyệt hoàn tiền và quyền export dữ liệu.")}
    <section class="grid cols-2">
      ${[
        ["Verifier", "Duyệt KYC, yêu cầu bổ sung giấy tờ, không được hoàn tiền."],
        ["Support", "Xử lý khiếu nại, nhắn khách, tạo escalation."],
        ["Accountant", "Đối soát giao dịch, duyệt hoàn tiền trong hạn mức."],
        ["Super Admin", "Quản lý role, API keys, export dữ liệu và feature flags."]
      ].map(([title, body]) => `<article class="card pad"><h3>${title}</h3><p class="subtle" style="margin-top:8px">${body}</p><button class="btn secondary" style="margin-top:16px" data-admin-action="${title}">Sửa quyền</button></article>`).join("")}
    </section>
  `;
}

function adminSettings() {
  return `
    ${adminHeader("Cài đặt hệ thống", "Phân quyền, bảo mật, API keys, export dữ liệu và feature flags.")}
    <section class="grid cols-2">
      ${[
        ["Phân quyền", "Admin, CSKH, duyệt tin, kế toán."],
        ["API keys", "Kết nối CRM, kế toán, Zalo OA."],
        ["Security sessions", "MFA, thiết bị lạ, thu hồi phiên."],
        ["Feature flags", "Rollout map search, escrow, AI QA."]
      ].map(([title, body]) => `<article class="card pad"><h3>${title}</h3><p class="subtle" style="margin-top:8px">${body}</p><button class="btn secondary" style="margin-top:16px" data-admin-action="${title}">Mở</button></article>`).join("")}
    </section>
  `;
}

function adminActionPanel(title, body, action) {
  return `
    <section class="section card pad">
      <h3>${title}</h3>
      <p class="subtle" style="margin-top:8px">${body}</p>
      <div class="actions" style="margin-top:18px">
        <button class="btn" data-admin-action="${escapeHtml(action)}">${action}</button>
        <button class="btn secondary">Xem log</button>
      </div>
    </section>
  `;
}

function tableSection(title, headers, rows) {
  return `<section class="section card pad"><h3>${title}</h3>${table(headers, rows)}</section>`;
}

function table(headers, rows) {
  return `
    <table class="table" style="margin-top:16px">
      <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  `;
}

function renderApp(path = "home", id) {
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

function phoneBookingPage(item, baseRoute) {
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

function phoneMessagesPage(baseRoute) {
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

function phonePaymentsPage(baseRoute) {
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

function phoneAccountPage(baseRoute) {
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

function renderWebApp(path = "dashboard", id) {
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

function emptyState(title, body) {
  return `<div class="empty-state"><div><h3>${title}</h3><p>${body}</p></div></div>`;
}

function setApp(html) {
  document.getElementById("app").innerHTML = html + `<div class="toast" id="toast" role="status"></div>`;
  setTimeout(() => {
    const chatList = document.querySelector?.(".chat-list");
    if (chatList) chatList.scrollTop = chatList.scrollHeight;
  }, 0);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function handleRouteClick(target) {
  const route = target.closest("[data-route]")?.dataset.route;
  if (!route) return false;
  routeTo(route);
  return true;
}

document.addEventListener("click", (event) => {
  const routeTarget = event.target.closest("[data-route]");
  if (routeTarget) {
    event.preventDefault();
    handleRouteClick(routeTarget);
    return;
  }

  const saveTarget = event.target.closest("[data-save]");
  if (saveTarget) {
    const id = saveTarget.dataset.save;
    state.saved = state.saved.includes(id) ? state.saved.filter((item) => item !== id) : [...state.saved, id];
    persist();
    render();
    showToast(state.saved.includes(id) ? "Đã lưu nhà." : "Đã bỏ lưu.");
    return;
  }

  const paymentTarget = event.target.closest("[data-payment]");
  if (paymentTarget) {
    state.lastPayment = paymentTarget.dataset.payment;
    persist();
    render();
    showToast(state.lastPayment === "success" ? "Đã ghi nhận thanh toán." : "Thanh toán chưa thành công.");
    return;
  }

  const adminTarget = event.target.closest("[data-admin-action]");
  if (adminTarget) {
    showToast(`Đã ghi nhận: ${adminTarget.dataset.adminAction}.`);
    return;
  }

  const accountTarget = event.target.closest("[data-account]");
  if (accountTarget) {
    state.notifications = ["Mã OTP demo: 2606", ...state.notifications.slice(0, 4)];
    persist();
    render();
    showToast("Đã gửi OTP demo.");
  }
});

document.addEventListener("submit", (event) => {
  const searchFormNode = event.target.closest("[data-search-form]");
  if (searchFormNode) {
    event.preventDefault();
    const data = new FormData(searchFormNode);
    state.filters = {
      keyword: data.get("keyword") || "",
      district: data.get("district") || "Tất cả",
      budget: data.get("budget") || "Tất cả"
    };
    persist();
    const targetRoute = searchFormNode.dataset.targetRoute || "/web/search";
    routeTo(targetRoute);
    return;
  }

  const bookingForm = event.target.closest("[data-booking-form]");
  if (bookingForm) {
    event.preventDefault();
    const data = new FormData(bookingForm);
    const listingId = bookingForm.dataset.bookingForm;
    state.bookings = [
      {
        id: `BK-${Date.now().toString().slice(-4)}`,
        listingId,
        date: data.get("date") || "Thứ 7, 22/06",
        time: data.get("time") || "09:00 - 11:00",
        status: "Chờ chủ nhà xác nhận"
      },
      ...state.bookings
    ];
    state.notifications = [`Đã gửi yêu cầu đặt lịch ${listingById(listingId).title}.`, ...state.notifications.slice(0, 4)];
    persist();
    const successRoute = bookingForm.dataset.successRoute || "/web/payments";
    routeTo(successRoute);
    showToast("Đã tạo lịch xem.");
    return;
  }

  const messageForm = event.target.closest("[data-message-form]");
  if (messageForm) {
    event.preventDefault();
    const input = messageForm.querySelector("input[name='message']");
    const body = input?.value?.trim();
    if (body) {
      state.messages = [...state.messages, { from: "Bạn", body }];
      persist();
      render();
      showToast("Đã gửi tin nhắn.");
    }
    return;
  }

  const postForm = event.target.closest("[data-post-form]");
  if (postForm) {
    event.preventDefault();
    showToast("Đã lưu tin nháp. Chuyển sang Owner Center.");
    routeTo("/web/owner");
  }
});

function render() {
  const [area, path, id] = routeParts();
  if (area === "admin") return renderAdmin(path || "overview");
  if (area === "web_app") return renderWebApp(path || "dashboard", id);
  if (area === "app" || area === "mobile") return renderApp(path || "home", id);
  return renderWeb(path || "home", id);
}

window.addEventListener("hashchange", render);
window.addEventListener("popstate", render);
render();
