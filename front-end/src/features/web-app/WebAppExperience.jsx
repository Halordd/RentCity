import { assets } from "../../data.js";
import { useRentCity } from "../../app/AppProvider.jsx";
import { listingsService } from "../../services/listings.service.js";
import { money } from "../../utils.js";
import { EmptyState, ListingCard, PhoneShell, RouteButton, SearchForm } from "../../components/ui.jsx";
import { PhoneAccount, PhoneBooking, PhoneMessages, PhonePayments } from "../app/MobileApp.jsx";

export function WebAppExperience({ route, navigate }) {
  const page = route.path || "dashboard";
  let content;
  if (page === "search") content = <WebAppSearch navigate={navigate} />;
  else if (page === "listing") content = <WebAppListing id={route.id} navigate={navigate} />;
  else if (page === "booking") content = <PhoneBooking id={route.id} baseRoute="/web_app" navigate={navigate} />;
  else if (page === "saved") content = <WebAppSaved navigate={navigate} />;
  else if (page === "manage") content = <WebAppManage navigate={navigate} />;
  else if (page === "bookings") content = <WebAppBookings />;
  else if (page === "messages") content = <PhoneMessages baseRoute="/web_app" navigate={navigate} />;
  else if (page === "payments") content = <PhonePayments baseRoute="/web_app" navigate={navigate} />;
  else if (page === "account") content = <PhoneAccount baseRoute="/web_app" navigate={navigate} />;
  else if (page === "profile") content = <WebAppProfile navigate={navigate} />;
  else content = <WebAppDashboard navigate={navigate} />;

  return <main className="mobile-stage"><PhoneShell active={page} baseRoute="/web_app" webApp navigate={navigate}>{content}</PhoneShell></main>;
}

function WebAppDashboard({ navigate }) {
  const { state } = useRentCity();
  return <><span className="eyebrow">Web app trên phone</span><h2 style={{ marginTop: 8 }}>RentCity PWA</h2><p className="subtle" style={{ marginTop: 8 }}>Dùng nhanh trên trình duyệt điện thoại: tìm nhà, đặt lịch, theo dõi cọc và quản lý nhà đang thuê.</p><div className="grid" style={{ marginTop: 18 }}><button className="mobile-card" onClick={() => navigate("/web_app/search")} style={{ textAlign: "left" }}><div className="inner"><h3>Tìm nhà quanh bạn</h3><p className="subtle">Bộ lọc giá, khu vực, tiện ích và bản đồ.</p></div></button><button className="mobile-card" onClick={() => navigate("/web_app/manage")} style={{ textAlign: "left" }}><div className="inner"><h3>Nhà đang thuê</h3><p className="subtle">Cọc, hợp đồng, thanh toán, bảo trì.</p></div></button><button className="mobile-card" onClick={() => navigate("/web_app/bookings")} style={{ textAlign: "left" }}><div className="inner"><h3>Lịch xem</h3><p className="subtle">{state.bookings.length} lịch đang theo dõi.</p></div></button></div></>;
}

function WebAppSearch({ navigate }) {
  const { state } = useRentCity();
  return <><h2>Tìm nhà trên web app</h2><SearchForm compact targetRoute="/web_app/search" navigate={navigate} /><div className="grid" style={{ marginTop: 18 }}>{listingsService.list(state.filters).map((item) => <ListingCard key={item.id} item={item} variant="mobile" baseRoute="/web_app" navigate={navigate} />)}</div></>;
}

function WebAppListing({ id, navigate }) {
  const item = listingsService.getById(id);
  const { state, dispatch, notify } = useRentCity();
  const saved = state.saved.includes(item.id);
  return <><img className="card" src={item.image} alt={item.title} style={{ height: 210, width: "100%", objectFit: "cover", marginBottom: 16 }} /><h2>{item.title}</h2><p className="subtle" style={{ marginTop: 8 }}>{item.address} · {item.area}m2</p><p className="price" style={{ marginTop: 12 }}>{money(item.price)}</p><div className="chip-row" style={{ marginTop: 14 }}>{item.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div><div className="actions" style={{ marginTop: 18 }}><RouteButton to={`/web_app/booking/${item.id}`} navigate={navigate}>Đặt lịch</RouteButton><button className="btn secondary" onClick={() => { dispatch({ type: "saved/toggle", payload: item.id }); notify(saved ? "Đã bỏ lưu." : "Đã lưu nhà."); }}>{saved ? "Đã lưu" : "Lưu"}</button></div></>;
}

function WebAppSaved({ navigate }) {
  const { state } = useRentCity();
  const savedItems = listingsService.saved(state.saved);
  return <><h2>Nhà đã lưu</h2><div className="grid" style={{ marginTop: 16 }}>{savedItems.length ? savedItems.map((item) => <ListingCard key={item.id} item={item} variant="mobile" baseRoute="/web_app" navigate={navigate} />) : <EmptyState title="Chưa lưu nhà nào" body="Bấm lưu ở một nhà phù hợp để xem lại tại đây." />}</div></>;
}

function WebAppManage({ navigate }) {
  return <><h2>Nhà đang thuê</h2><div className="mobile-card" style={{ marginTop: 16 }}><img src={assets.bedroom} alt="Studio Nguyễn Văn Cừ" /><div className="inner"><h3>Studio Nguyễn Văn Cừ</h3><p className="subtle">Hợp đồng 12 tháng · cọc 5.8tr · kỳ thanh toán 22/06</p><div className="chip-row" style={{ marginTop: 12 }}><span className="chip">Đang thuê</span><span className="chip blue">Hợp đồng sẵn sàng</span></div></div></div><div className="grid" style={{ marginTop: 14 }}><RouteButton className="card pad" to="/web_app/payments" navigate={navigate} style={{ textAlign: "left" }}>Thanh toán & biên nhận</RouteButton><RouteButton className="card pad" to="/web_app/messages" navigate={navigate} style={{ textAlign: "left" }}>Tin nhắn chủ nhà</RouteButton><button className="card pad" style={{ textAlign: "left" }}>Gửi yêu cầu bảo trì</button></div></>;
}

function WebAppBookings() {
  const { state } = useRentCity();
  return <><h2>Lịch xem trên web app</h2><div className="grid" style={{ marginTop: 16 }}>{state.bookings.map((booking) => { const item = listingsService.getById(booking.listingId); return <article className="mobile-card" key={booking.id}><div className="inner"><h3>{item.title}</h3><p className="subtle">{booking.date} · {booking.time}</p><span className="chip">{booking.status}</span></div></article>; })}</div></>;
}

function WebAppProfile({ navigate }) {
  return <><h2>Hồ sơ web app</h2><div className="mobile-card" style={{ marginTop: 16 }}><div className="inner"><h3>Nguyễn Minh Anh</h3><p className="subtle">Dùng trên trình duyệt phone, dữ liệu lưu cục bộ ở máy.</p></div></div><div className="grid"><RouteButton className="card pad" to="/web_app/manage" navigate={navigate} style={{ textAlign: "left" }}>Nhà đang thuê</RouteButton><RouteButton className="card pad" to="/web_app/saved" navigate={navigate} style={{ textAlign: "left" }}>Nhà đã lưu</RouteButton><RouteButton className="card pad" to="/web_app/messages" navigate={navigate} style={{ textAlign: "left" }}>Tin nhắn</RouteButton><RouteButton className="card pad" to="/web_app/account" navigate={navigate} style={{ textAlign: "left" }}>Bảo mật OTP</RouteButton></div></>;
}
