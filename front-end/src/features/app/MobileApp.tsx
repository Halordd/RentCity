import { useEffect, useRef, useState, type FormEvent } from "react";
import { isApiConfigured } from "../../api/httpClient";
import { useRentCity } from "../../app/useRentCity";
import { authService } from "../../services/auth.service";
import { createBooking, createBookingRemote } from "../../services/bookings.service";
import { listingsService } from "../../services/listings.service";
import { messagesService } from "../../services/messages.service";
import { money } from "../../utils";
import { EmptyState, ListingCard, PhoneShell, RouteButton, SearchForm } from "../../components/ui";
import type { NavigateTo, RoutedScreenProps } from "../../types";

interface NavigateProps {
  navigate: NavigateTo;
}

interface ListingPageProps extends NavigateProps {
  id?: string;
}

interface PhoneRouteProps extends ListingPageProps {
  baseRoute: string;
}

export function MobileApp({ route, navigate }: RoutedScreenProps) {
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

function MobileHome({ navigate }: NavigateProps) {
  const { state } = useRentCity();
  return <><span className="eyebrow">Xin chào Minh Anh</span><h2 style={{ marginTop: 8 }}>Tìm nhà quanh bạn</h2><SearchForm compact targetRoute="/app/search" navigate={navigate} /><div className="grid" style={{ marginTop: 18 }}>{listingsService.featured(state.listings).slice(0, 2).map((item) => <ListingCard item={item} variant="mobile" key={item.id} navigate={navigate} />)}</div></>;
}

function MobileSearch({ navigate }: NavigateProps) {
  const { state } = useRentCity();
  return <><h2>Kết quả phù hợp</h2><div className="chip-row" style={{ margin: "14px 0" }}><span className="chip">Quận 7</span><span className="chip blue">5-8tr</span><span className="chip amber">Có ban công</span></div>{listingsService.list(state.filters, state.listings).map((item) => <ListingCard item={item} variant="mobile" key={item.id} navigate={navigate} />)}</>;
}

function MobileSaved({ navigate }: NavigateProps) {
  const { state } = useRentCity();
  const savedItems = listingsService.saved(state.saved, state.listings);
  return <><h2>Nhà đã lưu</h2><div className="grid" style={{ marginTop: 16 }}>{savedItems.length ? savedItems.map((item) => <ListingCard item={item} variant="mobile" key={item.id} navigate={navigate} />) : <EmptyState title="Chưa lưu nhà nào" body="Bấm lưu ở một nhà phù hợp để xem lại tại đây." />}</div></>;
}

function MobileListing({ id, navigate }: ListingPageProps) {
  const { state, dispatch, notify } = useRentCity();
  const item = listingsService.getById(id, state.listings);
  const saved = state.saved.includes(item.id);
  return <><img className="card" src={item.image} alt={item.title} style={{ height: 210, width: "100%", objectFit: "cover", marginBottom: 16 }} /><h2>{item.title}</h2><p className="subtle" style={{ marginTop: 8 }}>{item.district} · {item.area}m2 · {item.deposit}</p><p className="price" style={{ marginTop: 12 }}>{money(item.price)}</p><div className="chip-row" style={{ marginTop: 14 }}>{item.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div><div className="actions" style={{ marginTop: 18 }}><RouteButton to={`/app/booking/${item.id}`} navigate={navigate}>Đặt lịch</RouteButton><button className="btn secondary" onClick={() => { dispatch({ type: "saved/toggle", payload: item.id }); notify(saved ? "Đã bỏ lưu." : "Đã lưu nhà."); }}>{saved ? "Đã lưu" : "Lưu"}</button></div></>;
}

export function PhoneBooking({ id, baseRoute, navigate }: PhoneRouteProps) {
  const { state, dispatch, notify } = useRentCity();
  const item = listingsService.getById(id, state.listings);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (isApiConfigured() && !state.auth) {
      notify("Vui lòng đăng nhập OTP trước khi đặt lịch.");
      navigate(`${baseRoute}/account`);
      return;
    }
    try {
      const booking = isApiConfigured()
        ? await createBookingRemote({ listingId: item.id, date: data.get("date"), time: data.get("time") })
        : createBooking({ listingId: item.id, date: data.get("date"), time: data.get("time") });
      dispatch({ type: "booking/add", payload: booking, meta: { listingTitle: item.title } });
      notify("Đã tạo lịch xem.");
      navigate(`${baseRoute}/payments`);
    } catch {
      notify("Chưa tạo được lịch xem từ backend.");
    }
  }
  return <><RouteButton className="btn secondary" to={`${baseRoute}/listing/${item.id}`} navigate={navigate}>Quay lại nhà</RouteButton><h2 style={{ marginTop: 16 }}>Đặt lịch xem nhà</h2><article className="mobile-card" style={{ marginTop: 16 }}><img src={item.image} alt={item.title} /><div className="inner"><h3>{item.title}</h3><p className="subtle">{item.district} · {item.area}m2 · {money(item.price)}</p></div></article><form className="card pad" onSubmit={submit} style={{ marginTop: 14 }}><label className="field"><span>Họ tên</span><input required defaultValue="Nguyễn Minh Anh" /></label><label className="field" style={{ marginTop: 12 }}><span>Số điện thoại</span><input required defaultValue="0912 345 678" /></label><label className="field" style={{ marginTop: 12 }}><span>Ngày xem</span><input name="date" required defaultValue="Thứ 7, 22/06" /></label><label className="field" style={{ marginTop: 12 }}><span>Khung giờ</span><select name="time" defaultValue="09:00 - 11:00"><option>09:00 - 11:00</option><option>14:30 - 16:00</option></select></label><button className="btn" type="submit" style={{ width: "100%", marginTop: 14 }}>Xác nhận đặt lịch</button></form></>;
}

function PhoneBookings() {
  const { state } = useRentCity();
  return <><h2>Lịch xem</h2><div className="grid" style={{ marginTop: 16 }}>{state.bookings.map((booking) => { const item = listingsService.getById(booking.listingId, state.listings); return <article className="mobile-card" key={booking.id}><div className="inner"><h3>{item.title}</h3><p className="subtle">{booking.date} · {booking.time}</p><span className="chip">{booking.status}</span></div></article>; })}</div></>;
}

export function PhoneMessages({ baseRoute, navigate }: { baseRoute: string; navigate: NavigateTo }) {
  const { state, dispatch, notify } = useRentCity();
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [state.messages.length]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("message") as HTMLInputElement | null;
    if (!input) return;
    const body = input.value.trim();
    if (!body) return;
    try {
      if (isApiConfigured() && state.activeConversationId && state.auth) {
        const message = await messagesService.sendRemote(state.activeConversationId, body, state.auth.user.id);
        dispatch({ type: "messages/set", payload: [...state.messages, message], meta: { conversationId: state.activeConversationId } });
      } else {
        dispatch({ type: "message/add", payload: body });
      }
      notify("Đã gửi tin nhắn.");
      input.value = "";
    } catch {
      notify("Chưa gửi được tin nhắn.");
    }
  }
  return <section className="chat-screen"><div className="chat-head"><h2>Tin nhắn</h2><p className="subtle">Trao đổi với chủ nhà và lưu lại lịch sử thương lượng.</p></div><div className="chat-list" ref={listRef} aria-label="Danh sách tin nhắn">{state.messages.map((msg, index) => <div className={`chat-bubble ${msg.from === "Bạn" ? "me" : "them"}`} key={`${msg.body}-${index}`}><strong>{msg.from}</strong><p className="subtle">{msg.body}</p></div>)}</div><div className="chat-composer"><form className="actions" onSubmit={submit}><input name="message" placeholder="Nhập tin nhắn..." /><button className="btn" type="submit">Gửi</button></form><RouteButton className="btn secondary" to={`${baseRoute}/bookings`} navigate={navigate}>Xem lịch hẹn</RouteButton></div></section>;
}

export function PhonePayments({ baseRoute, navigate }: { baseRoute: string; navigate: NavigateTo }) {
  const { state, dispatch, notify } = useRentCity();
  return <><h2>Cọc & hợp đồng</h2><div className="grid" style={{ marginTop: 16 }}><div className="stat"><span>Tiền cọc giữ chỗ</span><strong>5.8tr</strong><p className="subtle">Chờ xác nhận biên nhận</p></div><div className="stat"><span>Hợp đồng nháp</span><strong>1</strong><p className="subtle">Sẵn sàng để xem</p></div></div><div className="card pad" style={{ marginTop: 16 }}><h3>Thanh toán cọc</h3><p className="subtle" style={{ marginTop: 8 }}>Theo dõi tiền cọc, biên nhận và trạng thái xác nhận thanh toán.</p><div className="actions" style={{ marginTop: 14 }}><button className="btn" onClick={() => { dispatch({ type: "payment/set", payload: "success" }); notify("Đã ghi nhận thanh toán."); }}>Đã chuyển khoản</button><button className="btn secondary" onClick={() => { dispatch({ type: "payment/set", payload: "failed" }); notify("Thanh toán chưa thành công."); }}>Báo lỗi</button></div><span className={`chip ${state.lastPayment === "failed" ? "red" : ""}`} style={{ marginTop: 14 }}>{state.lastPayment === "failed" ? "Chưa thành công" : "Sẵn sàng"}</span></div><RouteButton className="btn secondary" to={`${baseRoute}/messages`} navigate={navigate} style={{ width: "100%", marginTop: 12 }}>Nhắn chủ nhà</RouteButton></>;
}

export function PhoneAccount({ baseRoute, navigate }: { baseRoute: string; navigate: NavigateTo }) {
  const { state, dispatch, notify } = useRentCity();
  const [phone, setPhone] = useState(state.auth?.user.phone || "+84912345678");
  const [code, setCode] = useState("");

  async function requestOtp() {
    if (!isApiConfigured()) {
      dispatch({ type: "otp/send" });
      notify("Đã gửi OTP demo.");
      return;
    }
    try {
      const result = await authService.requestOtp(phone);
      notify(result.devCode ? `OTP dev: ${result.devCode}` : "Đã gửi OTP.");
    } catch {
      notify("Chưa gửi được OTP.");
    }
  }

  async function verifyOtp() {
    if (!isApiConfigured()) return;
    try {
      const session = await authService.verifyOtp(phone, code);
      dispatch({ type: "auth/set", payload: session });
      notify("Đăng nhập thành công.");
    } catch {
      notify("OTP không hợp lệ hoặc đã hết hạn.");
    }
  }

  async function logout() {
    if (isApiConfigured()) await authService.logout(state.auth?.refreshToken).catch(() => undefined);
    dispatch({ type: "auth/set", payload: null });
    notify("Đã đăng xuất.");
  }

  return <><h2>Bảo mật tài khoản</h2><div className="card pad" style={{ marginTop: 16 }}><h3>OTP & phiên đăng nhập</h3><label className="field" style={{ marginTop: 12 }}><span>Số điện thoại</span><input value={phone} onChange={(event) => setPhone(event.target.value)} /></label><label className="field" style={{ marginTop: 12 }}><span>Mã OTP</span><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Nhập mã OTP" /></label><div className="actions" style={{ marginTop: 14 }}><button className="btn" type="button" onClick={requestOtp}>Gửi mã OTP</button><button className="btn secondary" type="button" onClick={verifyOtp}>Xác minh</button>{state.auth && <button className="btn secondary" type="button" onClick={logout}>Đăng xuất</button>}</div>{state.auth && <p className="subtle" style={{ marginTop: 12 }}>Đang đăng nhập: {state.auth.user.fullName || state.auth.user.phone}</p>}</div><div className="grid" style={{ marginTop: 14 }}><RouteButton className="card pad" to={`${baseRoute}/messages`} navigate={navigate} style={{ textAlign: "left" }}>Thông báo & tin nhắn</RouteButton><RouteButton className="card pad" to={`${baseRoute}/payments`} navigate={navigate} style={{ textAlign: "left" }}>Cọc & hợp đồng</RouteButton></div></>;
}

function MobileProfile({ navigate }: NavigateProps) {
  return <><h2>Tài khoản</h2><div className="mobile-card"><div className="inner"><h3>Nguyễn Minh Anh</h3><p className="subtle">Đã xác minh số điện thoại</p></div></div><div className="grid"><RouteButton className="card pad" to="/app/saved" navigate={navigate} style={{ textAlign: "left" }}>Nhà đã lưu</RouteButton><RouteButton className="card pad" to="/app/payments" navigate={navigate} style={{ textAlign: "left" }}>Thanh toán & hợp đồng</RouteButton><RouteButton className="card pad" to="/app/messages" navigate={navigate} style={{ textAlign: "left" }}>Tin nhắn</RouteButton><RouteButton className="card pad" to="/app/account" navigate={navigate} style={{ textAlign: "left" }}>Bảo mật OTP</RouteButton></div></>;
}
