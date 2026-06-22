import { useEffect, useRef } from "react";
import { useRentCity } from "../../app/AppProvider.jsx";
import { createBooking } from "../../services/bookings.service.js";
import { listingsService } from "../../services/listings.service.js";
import { money } from "../../utils.js";
import { EmptyState, ListingCard, PhoneShell, RouteButton, SearchForm } from "../../components/ui.jsx";

export function MobileApp({ route, navigate }) {
  const page = route.path || "home";
  let content;
  if (page === "search") content = <MobileSearch navigate={navigate} />;
  else if (page === "listing") content = <MobileListing id={route.id} navigate={navigate} />;
  else if (page === "booking") content = <PhoneBooking id={route.id} baseRoute="/app" navigate={navigate} />;
  else if (page === "saved") content = <MobileSaved navigate={navigate} />;
  else if (page === "bookings") content = <PhoneBookings />;
  else if (page === "messages") content = <PhoneMessages baseRoute="/app" navigate={navigate} />;
  else if (page === "payments") content = <PhonePayments baseRoute="/app" navigate={navigate} />;
  else if (page === "account") content = <PhoneAccount baseRoute="/app" navigate={navigate} />;
  else if (page === "profile") content = <MobileProfile navigate={navigate} />;
  else content = <MobileHome navigate={navigate} />;

  return <main className="mobile-stage"><PhoneShell active={page} navigate={navigate}>{content}</PhoneShell></main>;
}

function MobileHome({ navigate }) {
  return <><span className="eyebrow">Xin chào Minh Anh</span><h2 style={{ marginTop: 8 }}>Tìm nhà quanh bạn</h2><SearchForm compact targetRoute="/app/search" navigate={navigate} /><div className="grid" style={{ marginTop: 18 }}>{listingsService.featured().slice(0, 2).map((item) => <ListingCard item={item} variant="mobile" key={item.id} navigate={navigate} />)}</div></>;
}

function MobileSearch({ navigate }) {
  const { state } = useRentCity();
  return <><h2>Kết quả phù hợp</h2><div className="chip-row" style={{ margin: "14px 0" }}><span className="chip">Quận 7</span><span className="chip blue">5-8tr</span><span className="chip amber">Có ban công</span></div>{listingsService.list(state.filters).map((item) => <ListingCard item={item} variant="mobile" key={item.id} navigate={navigate} />)}</>;
}

function MobileSaved({ navigate }) {
  const { state } = useRentCity();
  const savedItems = listingsService.saved(state.saved);
  return <><h2>Nhà đã lưu</h2><div className="grid" style={{ marginTop: 16 }}>{savedItems.length ? savedItems.map((item) => <ListingCard item={item} variant="mobile" key={item.id} navigate={navigate} />) : <EmptyState title="Chưa lưu nhà nào" body="Bấm lưu ở một nhà phù hợp để xem lại tại đây." />}</div></>;
}

function MobileListing({ id, navigate }) {
  const item = listingsService.getById(id);
  const { state, dispatch, notify } = useRentCity();
  const saved = state.saved.includes(item.id);
  return <><img className="card" src={item.image} alt={item.title} style={{ height: 210, width: "100%", objectFit: "cover", marginBottom: 16 }} /><h2>{item.title}</h2><p className="subtle" style={{ marginTop: 8 }}>{item.district} · {item.area}m2 · {item.deposit}</p><p className="price" style={{ marginTop: 12 }}>{money(item.price)}</p><div className="chip-row" style={{ marginTop: 14 }}>{item.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div><div className="actions" style={{ marginTop: 18 }}><RouteButton to={`/app/booking/${item.id}`} navigate={navigate}>Đặt lịch</RouteButton><button className="btn secondary" onClick={() => { dispatch({ type: "saved/toggle", payload: item.id }); notify(saved ? "Đã bỏ lưu." : "Đã lưu nhà."); }}>{saved ? "Đã lưu" : "Lưu"}</button></div></>;
}

export function PhoneBooking({ id, baseRoute, navigate }) {
  const item = listingsService.getById(id);
  const { dispatch, notify } = useRentCity();
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch({ type: "booking/add", payload: createBooking({ listingId: item.id, date: data.get("date"), time: data.get("time") }), meta: { listingTitle: item.title } });
    notify("Đã tạo lịch xem.");
    navigate(`${baseRoute}/payments`);
  }
  return <><RouteButton className="btn secondary" to={`${baseRoute}/listing/${item.id}`} navigate={navigate}>Quay lại nhà</RouteButton><h2 style={{ marginTop: 16 }}>Đặt lịch xem nhà</h2><article className="mobile-card" style={{ marginTop: 16 }}><img src={item.image} alt={item.title} /><div className="inner"><h3>{item.title}</h3><p className="subtle">{item.district} · {item.area}m2 · {money(item.price)}</p></div></article><form className="card pad" onSubmit={submit} style={{ marginTop: 14 }}><label className="field"><span>Họ tên</span><input required defaultValue="Nguyễn Minh Anh" /></label><label className="field" style={{ marginTop: 12 }}><span>Số điện thoại</span><input required defaultValue="0912 345 678" /></label><label className="field" style={{ marginTop: 12 }}><span>Ngày xem</span><input name="date" required defaultValue="Thứ 7, 22/06" /></label><label className="field" style={{ marginTop: 12 }}><span>Khung giờ</span><select name="time" defaultValue="09:00 - 11:00"><option>09:00 - 11:00</option><option>14:30 - 16:00</option></select></label><button className="btn" type="submit" style={{ width: "100%", marginTop: 14 }}>Xác nhận đặt lịch</button></form></>;
}

function PhoneBookings() {
  const { state } = useRentCity();
  return <><h2>Lịch xem</h2><div className="grid" style={{ marginTop: 16 }}>{state.bookings.map((booking) => { const item = listingsService.getById(booking.listingId); return <article className="mobile-card" key={booking.id}><div className="inner"><h3>{item.title}</h3><p className="subtle">{booking.date} · {booking.time}</p><span className="chip">{booking.status}</span></div></article>; })}</div></>;
}

export function PhoneMessages({ baseRoute, navigate }) {
  const { state, dispatch, notify } = useRentCity();
  const listRef = useRef(null);
  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [state.messages.length]);
  function submit(event) {
    event.preventDefault();
    const input = event.currentTarget.elements.message;
    const body = input.value.trim();
    if (!body) return;
    dispatch({ type: "message/add", payload: body });
    notify("Đã gửi tin nhắn.");
    input.value = "";
  }
  return <section className="chat-screen"><div className="chat-head"><h2>Tin nhắn</h2><p className="subtle">Trao đổi với chủ nhà và lưu lại lịch sử thương lượng.</p></div><div className="chat-list" ref={listRef} aria-label="Danh sách tin nhắn">{state.messages.map((msg, index) => <div className={`chat-bubble ${msg.from === "Bạn" ? "me" : "them"}`} key={`${msg.body}-${index}`}><strong>{msg.from}</strong><p className="subtle">{msg.body}</p></div>)}</div><div className="chat-composer"><form className="actions" onSubmit={submit}><input name="message" placeholder="Nhập tin nhắn..." /><button className="btn" type="submit">Gửi</button></form><RouteButton className="btn secondary" to={`${baseRoute}/bookings`} navigate={navigate}>Xem lịch hẹn</RouteButton></div></section>;
}

export function PhonePayments({ baseRoute, navigate }) {
  const { state, dispatch, notify } = useRentCity();
  return <><h2>Cọc & hợp đồng</h2><div className="grid" style={{ marginTop: 16 }}><div className="stat"><span>Tiền cọc giữ chỗ</span><strong>5.8tr</strong><p className="subtle">Chờ xác nhận biên nhận</p></div><div className="stat"><span>Hợp đồng nháp</span><strong>1</strong><p className="subtle">Sẵn sàng để xem</p></div></div><div className="card pad" style={{ marginTop: 16 }}><h3>Thanh toán cọc</h3><p className="subtle" style={{ marginTop: 8 }}>Theo dõi tiền cọc, biên nhận và trạng thái xác nhận thanh toán.</p><div className="actions" style={{ marginTop: 14 }}><button className="btn" onClick={() => { dispatch({ type: "payment/set", payload: "success" }); notify("Đã ghi nhận thanh toán."); }}>Đã chuyển khoản</button><button className="btn secondary" onClick={() => { dispatch({ type: "payment/set", payload: "failed" }); notify("Thanh toán chưa thành công."); }}>Báo lỗi</button></div><span className={`chip ${state.lastPayment === "failed" ? "red" : ""}`} style={{ marginTop: 14 }}>{state.lastPayment === "failed" ? "Chưa thành công" : "Sẵn sàng"}</span></div><RouteButton className="btn secondary" to={`${baseRoute}/messages`} navigate={navigate} style={{ width: "100%", marginTop: 12 }}>Nhắn chủ nhà</RouteButton></>;
}

export function PhoneAccount({ baseRoute, navigate }) {
  const { dispatch, notify } = useRentCity();
  return <><h2>Bảo mật tài khoản</h2><div className="card pad" style={{ marginTop: 16 }}><h3>OTP & phiên đăng nhập</h3><p className="subtle" style={{ marginTop: 8 }}>Màn này sẽ nối OTP thật, quản lý thiết bị và đăng xuất phiên lạ khi có backend.</p><button className="btn" onClick={() => { dispatch({ type: "otp/send" }); notify("Đã gửi OTP demo."); }} style={{ width: "100%", marginTop: 14 }}>Gửi mã OTP</button></div><div className="grid" style={{ marginTop: 14 }}><RouteButton className="card pad" to={`${baseRoute}/messages`} navigate={navigate} style={{ textAlign: "left" }}>Thông báo & tin nhắn</RouteButton><RouteButton className="card pad" to={`${baseRoute}/payments`} navigate={navigate} style={{ textAlign: "left" }}>Cọc & hợp đồng</RouteButton></div></>;
}

function MobileProfile({ navigate }) {
  return <><h2>Tài khoản</h2><div className="mobile-card"><div className="inner"><h3>Nguyễn Minh Anh</h3><p className="subtle">Đã xác minh số điện thoại</p></div></div><div className="grid"><RouteButton className="card pad" to="/app/saved" navigate={navigate} style={{ textAlign: "left" }}>Nhà đã lưu</RouteButton><RouteButton className="card pad" to="/app/payments" navigate={navigate} style={{ textAlign: "left" }}>Thanh toán & hợp đồng</RouteButton><RouteButton className="card pad" to="/app/messages" navigate={navigate} style={{ textAlign: "left" }}>Tin nhắn</RouteButton><RouteButton className="card pad" to="/app/account" navigate={navigate} style={{ textAlign: "left" }}>Bảo mật OTP</RouteButton></div></>;
}
