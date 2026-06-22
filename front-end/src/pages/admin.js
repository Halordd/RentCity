import { adminRows } from '../data.js';
import { adminLogo, setApp } from '../components/shared.js';
import { escapeHtml } from '../utils.js';

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

export function renderAdmin(path = "overview") {
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
