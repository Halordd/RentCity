import type { ReactNode } from "react";
import { useRentCity } from "../../app/useRentCity";
import { adminService } from "../../services/admin.service";
import { Brand, RouteButton } from "../../components/ui";
import type { DataRow, NavigateTo, RoutedScreenProps } from "../../types";

const navItems = [
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

interface AdminPageProps {
  navigate: NavigateTo;
}

interface AdminHeaderProps extends AdminPageProps {
  title: string;
  body: string;
}

export function AdminConsole({ route, navigate }: RoutedScreenProps) {
  const active = route.path || "overview";
  const pages: Record<string, ReactNode> = {
    overview: <Overview navigate={navigate} />,
    listings: <Listings navigate={navigate} />,
    verification: <Verification navigate={navigate} />,
    automation: <Automation navigate={navigate} />,
    billing: <Billing navigate={navigate} />,
    disputes: <Disputes navigate={navigate} />,
    audit: <Audit navigate={navigate} />,
    access: <Access navigate={navigate} />,
    settings: <Settings navigate={navigate} />
  };
  return <div className="admin-layout"><aside className="admin-sidebar"><Brand admin to="/admin" navigate={navigate} /><nav className="admin-nav">{navItems.map(([key, label]) => <button className={active === key ? "active" : ""} key={key} onClick={() => navigate(`/admin/${key}`)}>{label}</button>)}</nav></aside><main className="admin-main">{pages[active] || pages.overview}</main></div>;
}

function AdminHeader({ title, body, navigate }: AdminHeaderProps) {
  return <div className="admin-top"><div><span className="eyebrow">RentCity admin</span><h1 style={{ fontSize: 44 }}>{title}</h1><p className="subtle">{body}</p></div><div className="actions"><RouteButton className="btn secondary" to="/admin/audit" navigate={navigate}>Audit log</RouteButton><RouteButton to="/admin/access" navigate={navigate}>Phân quyền</RouteButton></div></div>;
}

function Overview({ navigate }: AdminPageProps) {
  return <><AdminHeader title="Admin Command Center" body="Back-office cho kiểm duyệt, rủi ro, phân quyền, đối soát và audit toàn hệ thống." navigate={navigate} /><section className="stat-grid">{[["Hồ sơ KYC chờ duyệt", "11", "SLA còn 4 giờ"], ["Tin cần QA", "23", "Ảnh thật, giá, địa chỉ"], ["Dispute quá hạn", "3", "Ưu tiên xử lý hôm nay"], ["Cảnh báo quyền", "2", "Role thay đổi bất thường"]].map(([label, value, body]) => <div className="stat" key={label}><span>{label}</span><strong>{value}</strong><p className="subtle">{body}</p></div>)}</section><section className="section grid cols-2"><Workflow title="Hàng đợi kiểm soát" items={["KYC chủ nhà", "QA ảnh thật", "Duyệt hoàn cọc", "Audit role", "Feature flags"]} /><div className="card pad"><h3>Tác vụ hôm nay</h3><DataTable headers={["Tác vụ", "Ưu tiên", "SLA"]} rows={[["Duyệt 11 hồ sơ KYC", "Cao", "4h"], ["Khóa 2 tin nghi rủi ro", "Cao", "2h"], ["Kiểm tra 3 khiếu nại", "Cao", "2h"]]} /></div></section></>;
}

function Listings({ navigate }: AdminPageProps) { return <><AdminHeader title="Kiểm duyệt tin đăng" body="Hàng đợi QA độc lập với Owner Center: kiểm tra ảnh thật, giá, giấy tờ, tọa độ và dấu hiệu rủi ro trước khi public." navigate={navigate} /><TableSection title="Hàng đợi QA" headers={["Tin đăng", "Trạng thái kiểm duyệt", "Giá", "Điểm rủi ro"]} rows={adminService.rows.listings} /><ActionPanel title="Bộ quy tắc QA" body="Admin có thể giữ tin, yêu cầu bổ sung ảnh thật, khóa tin hoặc chuyển sang dispute nếu phát hiện bất thường." action="Mở hàng đợi QA" /></>; }
function Verification({ navigate }: AdminPageProps) { return <><AdminHeader title="Duyệt xác minh" body="Kiểm tra giấy tờ, tài khoản nhận cọc và ảnh nhà trước khi mở quyền đăng tin." navigate={navigate} /><TableSection title="Hồ sơ chờ duyệt" headers={["Chủ nhà", "Hạng mục", "Tình trạng", "Hành động"]} rows={adminService.rows.verification} /><ActionPanel title="Điểm tin cậy dự kiến" body="Hồ sơ Minh Nguyễn đạt 92/100 sau khi đối chiếu địa chỉ và ảnh thật." action="Duyệt hồ sơ" /></>; }
function Automation({ navigate }: AdminPageProps) { return <><AdminHeader title="Quy tắc hệ thống" body="Cấu hình automation cấp nền tảng: SLA, cảnh báo rủi ro, notification template và escalation cho support." navigate={navigate} /><section className="grid cols-2"><Workflow title="Khi phát sinh sự kiện nhạy cảm" items={["Ghi audit log", "Chạy rule rủi ro", "Gửi cảnh báo support", "Escalate nếu quá SLA"]} /><div className="card pad"><h3>Độ ổn định 7 ngày</h3><div className="stat-grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 16 }}>{[["Rule chạy đúng", "99.1%"], ["Escalation", "18"], ["False positive", "4"], ["Webhook lỗi", "2"]].map(([label, value]) => <div className="stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></div></section></>; }
function Billing({ navigate }: AdminPageProps) { return <><AdminHeader title="Tài chính & đối soát" body="Back-office cho cọc, hoàn tiền, hóa đơn, subscription chủ nhà và giao dịch cần kiểm tra." navigate={navigate} /><TableSection title="Giao dịch cần đối soát" headers={["Mã", "Ngày", "Số tiền", "Trạng thái"]} rows={adminService.financeRows} /><ActionPanel title="Cổng thanh toán" body="Kiểm tra webhook, biên nhận, mã giao dịch ngân hàng và quyền duyệt hoàn tiền." action="Kiểm tra kết nối" /></>; }
function Disputes({ navigate }: AdminPageProps) { return <><AdminHeader title="Trung tâm khiếu nại" body="Xử lý hoàn cọc, ảnh sai, chủ nhà không phản hồi và phí phát sinh." navigate={navigate} /><TableSection title="Hộp thư khiếu nại" headers={["Mã", "Loại", "SLA", "Trạng thái"]} rows={adminService.rows.disputes} /><ActionPanel title="DSP-102 - Hoàn tiền cọc" body="Khách báo chủ nhà hủy lịch sau khi đã nhận cọc giữ chỗ. Cần kiểm tra biên nhận và tin nhắn." action="Hoàn tiền" /></>; }
function Audit({ navigate }: AdminPageProps) { return <><AdminHeader title="Audit logs" body="Theo dõi hành động nhạy cảm: duyệt KYC, khóa tin, hoàn tiền, export dữ liệu và thay đổi phân quyền." navigate={navigate} /><TableSection title="Nhật ký hệ thống" headers={["Thời gian", "Người thao tác", "Hành động", "Kết quả"]} rows={adminService.auditRows} /><ActionPanel title="Xuất audit" body="Chỉ super admin được export log nhạy cảm theo khoảng thời gian và role." action="Xuất CSV" /></>; }
function Access({ navigate }: AdminPageProps) { return <><AdminHeader title="Phân quyền & bảo mật" body="Quản trị role nội bộ, MFA, phiên đăng nhập, quyền duyệt hoàn tiền và quyền export dữ liệu." navigate={navigate} /><section className="grid cols-2">{[["Verifier", "Duyệt KYC, yêu cầu bổ sung giấy tờ, không được hoàn tiền."], ["Support", "Xử lý khiếu nại, nhắn khách, tạo escalation."], ["Accountant", "Đối soát giao dịch, duyệt hoàn tiền trong hạn mức."], ["Super Admin", "Quản lý role, API keys, export dữ liệu và feature flags."]].map(([title, body]) => <article className="card pad" key={title}><h3>{title}</h3><p className="subtle" style={{ marginTop: 8 }}>{body}</p><button className="btn secondary" style={{ marginTop: 16 }}>Sửa quyền</button></article>)}</section></>; }
function Settings({ navigate }: AdminPageProps) { return <><AdminHeader title="Cài đặt hệ thống" body="Phân quyền, bảo mật, API keys, export dữ liệu và feature flags." navigate={navigate} /><section className="grid cols-2">{[["API keys", "Kết nối CRM, kế toán, Zalo OA."], ["Security sessions", "MFA, thiết bị lạ, thu hồi phiên."], ["Feature flags", "Rollout map search, escrow, AI QA."], ["Data export", "Quyền xuất dữ liệu và audit."]].map(([title, body]) => <article className="card pad" key={title}><h3>{title}</h3><p className="subtle" style={{ marginTop: 8 }}>{body}</p><button className="btn secondary" style={{ marginTop: 16 }}>Mở</button></article>)}</section></>; }

function Workflow({ title, items }: { title: string; items: string[] }) { return <div className="card pad"><h3>{title}</h3><div className="workflow" style={{ marginTop: 16 }}>{items.map((item, index) => <div className="workflow-step" key={item}><span className="num">{index + 1}</span><div><strong>{item}</strong><p className="subtle">Back-office xử lý</p></div></div>)}</div></div>; }
function ActionPanel({ title, body, action }: { title: string; body: string; action: string }) { const { notify } = useRentCity(); return <section className="section card pad"><h3>{title}</h3><p className="subtle" style={{ marginTop: 8 }}>{body}</p><div className="actions" style={{ marginTop: 18 }}><button className="btn" onClick={() => notify(`Đã ghi nhận: ${action}.`)}>{action}</button><button className="btn secondary">Xem log</button></div></section>; }
function TableSection({ title, headers, rows }: { title: string; headers: string[]; rows: DataRow[] }) { return <section className="section card pad"><h3>{title}</h3><DataTable headers={headers} rows={rows} /></section>; }
function DataTable({ headers, rows }: { headers: string[]; rows: DataRow[] }) { return <table className="table" style={{ marginTop: 16 }}><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table>; }
