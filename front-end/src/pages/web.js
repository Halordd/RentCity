import { assets, listings, listingById } from '../data.js';
import { state } from '../state.js';
import { filteredListings } from '../selectors.js';
import { escapeHtml, money } from '../utils.js';
import { emptyState, footer, listingCard, mapPanel, searchForm, setApp, topbar } from '../components/shared.js';

export function renderWeb(path = "home", id) {
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
