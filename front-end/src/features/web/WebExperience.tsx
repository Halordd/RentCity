import type { FormEvent } from "react";
import { assets } from "../../data";
import { useRentCity } from "../../app/useRentCity";
import { createBooking } from "../../services/bookings.service";
import { listingsService } from "../../services/listings.service";
import { money } from "../../utils";
import { EmptyState, Footer, ListingCard, ListingTile, MapPanel, RouteButton, SearchForm, WebTopbar } from "../../components/ui";
import type { NavigateTo, RoutedScreenProps } from "../../types";

interface NavigateProps {
  navigate: NavigateTo;
}

interface ListingPageProps extends NavigateProps {
  id?: string;
}

export function WebExperience({ route, navigate }: RoutedScreenProps) {
  const page = route.path || "home";
  let content;
  if (page === "search") content = <SearchPage navigate={navigate} />;
  else if (page === "listing") content = <DetailPage id={route.id} navigate={navigate} />;
  else if (page === "booking") content = <BookingPage id={route.id} navigate={navigate} />;
  else if (page === "saved") content = <SavedPage navigate={navigate} />;
  else if (page === "messages") content = <MessagesPage />;
  else if (page === "payments") content = <PaymentsPage />;
  else if (page === "owner") content = <OwnerPage navigate={navigate} />;
  else if (page === "post") content = <PostPage navigate={navigate} />;
  else if (page === "account") content = <AccountPage navigate={navigate} />;
  else content = <HomePage navigate={navigate} />;

  return (
    <>
      <WebTopbar navigate={navigate} />
      {content}
      <Footer navigate={navigate} />
    </>
  );
}

function HomePage({ navigate }: NavigateProps) {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">Nhà thật, lịch thật, quản lý thật</span>
          <h1>RentCity</h1>
          <p className="lead">Tìm trọ, thuê căn hộ và quản lý nhà cho thuê trong một sản phẩm thống nhất: ảnh thật, lịch xem, cọc, hợp đồng, tin nhắn và vận hành chủ nhà.</p>
          <SearchForm navigate={navigate} />
          <div className="metric-row" style={{ marginTop: 18 }}>
            <span className="chip">+42 nhà đã xác minh</span>
            <span className="chip blue">84% lịch xem xác nhận</span>
            <span className="chip amber">12 phút phản hồi trung bình</span>
          </div>
        </div>
        <article className="media-card">
          <img src={assets.house} alt="Nhà cho thuê thực tế" />
          <div className="media-card-body">
            <h3>Nhà nguyên căn Thảo Điền</h3>
            <p className="subtle" style={{ marginTop: 8 }}>2 phòng ngủ · nuôi pet · có sân nhỏ</p>
            <p className="price" style={{ marginTop: 14 }}>15tr/tháng</p>
          </div>
        </article>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Khám phá nhanh</span>
            <h2>Nhà nổi bật quanh khu vực</h2>
          </div>
          <RouteButton className="btn secondary" to="/web/search" navigate={navigate}>Xem tất cả</RouteButton>
        </div>
        <div className="grid cols-3">{listingsService.featured().map((item) => <ListingTile item={item} key={item.id} navigate={navigate} />)}</div>
      </section>
      <section className="section grid cols-3">
        {[
          ["Tìm thuê", "Bộ lọc giá, quận, tiện ích, bản đồ và so sánh chi phí trước khi liên hệ."],
          ["Ký thuê", "Đặt lịch, nhắn chủ nhà, thanh toán cọc và theo dõi hợp đồng."],
          ["Quản lý", "Dashboard chủ nhà, lịch xem, tin nhắn, cọc, hợp đồng và báo cáo doanh thu."]
        ].map(([title, body]) => (
          <article className="card pad" key={title}>
            <span className="chip">{title}</span>
            <h3 style={{ marginTop: 16 }}>{title}</h3>
            <p className="subtle" style={{ marginTop: 10 }}>{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function SearchPage({ navigate }: NavigateProps) {
  const { state } = useRentCity();
  const results = listingsService.list(state.filters);
  return (
    <main className="page">
      <span className="eyebrow">Tìm thuê</span>
      <h1 style={{ fontSize: 44 }}>Chọn nhà đúng nhu cầu</h1>
      <SearchForm compact navigate={navigate} />
      <div className="split section" style={{ paddingTop: 28 }}>
        <section className="grid">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="subtle">{results.length} kết quả phù hợp bộ lọc hiện tại</p>
            <RouteButton className="btn secondary" to="/web/saved" navigate={navigate}>Nhà đã lưu</RouteButton>
          </div>
          {results.length ? results.map((item) => <ListingCard item={item} key={item.id} navigate={navigate} />) : <EmptyState title="Chưa có nhà phù hợp" body="Thử nới ngân sách hoặc chọn quận khác." />}
        </section>
        <MapPanel navigate={navigate} />
      </div>
    </main>
  );
}

function DetailPage({ id, navigate }: ListingPageProps) {
  const item = listingsService.getById(id);
  const { state, dispatch, notify } = useRentCity();
  return (
    <main className="page">
      <RouteButton className="btn secondary" to="/web/search" navigate={navigate}>Quay lại kết quả</RouteButton>
      <section className="section split" style={{ paddingTop: 22 }}>
        <div>
          <div className="grid cols-2">
            <img className="card" src={item.image} alt={item.title} style={{ height: 360, width: "100%", objectFit: "cover" }} />
            <div className="grid">
              <img className="card" src={assets.livingroom} alt="Phòng khách" style={{ height: 171, width: "100%", objectFit: "cover" }} />
              <img className="card" src={assets.building} alt="Tòa nhà" style={{ height: 171, width: "100%", objectFit: "cover" }} />
            </div>
          </div>
          <div className="section-head" style={{ marginTop: 28 }}>
            <div>
              <span className="eyebrow">{item.verified ? "Đã xác minh" : "Chờ xác minh"}</span>
              <h1 style={{ fontSize: 46 }}>{item.title}</h1>
              <p className="lead" style={{ fontSize: 17 }}>{item.address} · {item.district}</p>
            </div>
            <p className="price">{money(item.price)}</p>
          </div>
          <div className="grid cols-3">{[[`${item.area}m2`, "Diện tích"], [item.rooms, "Phòng ngủ"], [item.wc, "WC"], [item.floor, "Vị trí"]].map(([value, label]) => <div className="stat" key={label}><span className="subtle">{label}</span><strong>{value}</strong></div>)}</div>
        </div>
        <aside className="grid" style={{ alignSelf: "start" }}>
          <div className="card pad">
            <h3>Đặt lịch xem nhà</h3>
            <label className="field" style={{ marginTop: 16 }}><span>Ngày xem</span><input defaultValue="Thứ 7, 22/06" /></label>
            <label className="field" style={{ marginTop: 12 }}><span>Khung giờ</span><select defaultValue="09:00 - 11:00"><option>09:00 - 11:00</option><option>14:30 - 16:00</option></select></label>
            <RouteButton to={`/web/booking/${item.id}`} navigate={navigate} style={{ width: "100%", marginTop: 16 }}>Đặt lịch</RouteButton>
            <RouteButton className="btn secondary" to="/web/messages" navigate={navigate} style={{ width: "100%", marginTop: 10 }}>Nhắn chủ nhà</RouteButton>
          </div>
          <div className="card pad">
            <h3>{item.owner}</h3>
            <p className="subtle" style={{ marginTop: 8 }}>Đã xác thực · {item.score}/100 điểm tin cậy</p>
            <div className="actions" style={{ marginTop: 14 }}>
              <button className="btn secondary" type="button" onClick={() => { dispatch({ type: "saved/toggle", payload: item.id }); notify(state.saved.includes(item.id) ? "Đã bỏ lưu." : "Đã lưu nhà."); }}>{state.saved.includes(item.id) ? "Đã lưu" : "Lưu nhà"}</button>
              <RouteButton className="btn secondary" to="/web/messages" navigate={navigate}>Chat</RouteButton>
            </div>
          </div>
          <MapPanel navigate={navigate} />
        </aside>
      </section>
    </main>
  );
}

function BookingPage({ id, navigate }: ListingPageProps) {
  const item = listingsService.getById(id);
  const { dispatch, notify } = useRentCity();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch({ type: "booking/add", payload: createBooking({ listingId: item.id, date: data.get("date"), time: data.get("time") }), meta: { listingTitle: item.title } });
    notify("Đã tạo lịch xem.");
    navigate("/web/payments");
  }
  return (
    <main className="page">
      <span className="eyebrow">Booking</span>
      <h1 style={{ fontSize: 44 }}>Hoàn tất đặt lịch xem</h1>
      <section className="section split" style={{ paddingTop: 24 }}>
        <form className="card pad" onSubmit={submit}>
          <h3>Thông tin lịch hẹn</h3>
          <div className="grid cols-2" style={{ marginTop: 18 }}>
            <label className="field"><span>Họ tên</span><input name="name" required defaultValue="Nguyễn Minh Anh" /></label>
            <label className="field"><span>Số điện thoại</span><input name="phone" required defaultValue="0912 345 678" /></label>
            <label className="field"><span>Ngày xem</span><input name="date" required defaultValue="Thứ 7, 22/06" /></label>
            <label className="field"><span>Khung giờ</span><select name="time" defaultValue="09:00 - 11:00"><option>09:00 - 11:00</option><option>14:30 - 16:00</option></select></label>
          </div>
          <label className="field" style={{ marginTop: 14 }}><span>Ghi chú</span><textarea name="note" defaultValue="Mình muốn xem phòng, hỏi thêm tiền điện nước và chỗ gửi xe." /></label>
          <div className="actions" style={{ marginTop: 18 }}>
            <button className="btn" type="submit">Xác nhận đặt lịch</button>
            <RouteButton className="btn secondary" to={`/web/listing/${item.id}`} navigate={navigate}>Xem lại nhà</RouteButton>
          </div>
        </form>
        <aside className="card">
          <img src={item.image} alt={item.title} style={{ height: 220, width: "100%", objectFit: "cover" }} />
          <div className="pad">
            <h3>{item.title}</h3>
            <p className="subtle" style={{ marginTop: 8 }}>{item.address}</p>
            <p className="price" style={{ marginTop: 12 }}>{money(item.price)}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function SavedPage({ navigate }: NavigateProps) {
  const { state } = useRentCity();
  const savedItems = listingsService.saved(state.saved);
  return <main className="page"><span className="eyebrow">Wishlist</span><h1 style={{ fontSize: 44 }}>Nhà đã lưu</h1><section className="section grid">{savedItems.length ? savedItems.map((item) => <ListingCard key={item.id} item={item} navigate={navigate} />) : <EmptyState title="Bạn chưa lưu nhà nào" body="Khi thấy nhà phù hợp, bấm lưu để so sánh sau." />}</section></main>;
}

function MessagesPage() {
  const { state, dispatch, notify } = useRentCity();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("message") as HTMLInputElement | null;
    if (!input) return;
    const body = input.value.trim();
    if (!body) return;
    dispatch({ type: "message/add", payload: body });
    notify("Đã gửi tin nhắn.");
    input.value = "";
  }
  return (
    <main className="page">
      <span className="eyebrow">Tin nhắn</span>
      <h1 style={{ fontSize: 44 }}>Trao đổi và thương lượng</h1>
      <section className="section card pad">
        <h3>Studio Nguyễn Văn Cừ</h3>
        <div className="grid" style={{ margin: "20px 0" }}>{state.messages.map((msg, index) => <div className="card pad" key={`${msg.body}-${index}`} style={{ maxWidth: "70%", ...(msg.from === "Bạn" ? { marginLeft: "auto", background: "#e8f5f3" } : {}) }}><strong>{msg.from}</strong><p className="subtle">{msg.body}</p></div>)}</div>
        <form className="actions" onSubmit={submit}><input name="message" placeholder="Nhập tin nhắn..." style={{ flex: 1, minHeight: 44, border: "1px solid var(--line)", borderRadius: 8, padding: "0 14px" }} /><button className="btn" type="submit">Gửi</button></form>
      </section>
    </main>
  );
}

function PaymentsPage() {
  const { state, dispatch, notify } = useRentCity();
  return (
    <main className="page">
      <span className="eyebrow">Thanh toán</span>
      <h1 style={{ fontSize: 44 }}>Cọc và hợp đồng</h1>
      <section className="section grid cols-3">
        <div className="stat"><span>Tiền cọc giữ chỗ</span><strong>5.8tr</strong><p className="subtle">Chờ xác nhận biên nhận</p></div>
        <div className="stat"><span>Hợp đồng nháp</span><strong>1</strong><p className="subtle">Sẵn sàng để xem</p></div>
        <div className="stat"><span>Lịch thanh toán</span><strong>22/06</strong><p className="subtle">Nhắc trước 2 ngày</p></div>
      </section>
      <section className="section split">
        <div className="card pad"><h3>Thanh toán cọc</h3><p className="subtle" style={{ marginTop: 8 }}>Theo dõi tiền cọc, biên nhận và trạng thái xác nhận thanh toán.</p><div className="actions" style={{ marginTop: 18 }}><button className="btn" onClick={() => { dispatch({ type: "payment/set", payload: "success" }); notify("Đã ghi nhận thanh toán."); }}>Xác nhận đã chuyển khoản</button><button className="btn secondary" onClick={() => { dispatch({ type: "payment/set", payload: "failed" }); notify("Thanh toán chưa thành công."); }}>Mô phỏng lỗi</button></div></div>
        <div className="card pad"><h3>Biên nhận gần nhất</h3><p className="subtle" style={{ marginTop: 8 }}>Mã RC-DEP-2606 · Studio Nguyễn Văn Cừ</p><span className={`chip ${state.lastPayment === "failed" ? "red" : ""}`} style={{ marginTop: 14 }}>{state.lastPayment === "failed" ? "Chưa thành công" : "Sẵn sàng"}</span></div>
      </section>
    </main>
  );
}

function OwnerPage({ navigate }: NavigateProps) {
  return <main className="page"><span className="eyebrow">Chủ nhà</span><h1 style={{ fontSize: 44 }}>Quản lý danh mục cho thuê</h1><section className="section stat-grid">{[["Nhà đang quản lý", "12", "8 tin đang hiển thị"], ["Lịch xem tuần này", "24", "84% xác nhận"], ["Doanh thu tháng", "128tr", "+18% so với tháng trước"], ["Cần xử lý", "6", "Hồ sơ và tin nhắn"]].map(([label, value, body]) => <div className="stat" key={label}><span>{label}</span><strong>{value}</strong><p className="subtle">{body}</p></div>)}</section><section className="section grid cols-2"><div className="card pad"><h3>Pipeline khách thuê</h3><div className="workflow" style={{ marginTop: 16 }}>{["Mới liên hệ", "Đặt lịch xem", "Đang thương lượng", "Chờ hợp đồng"].map((step, index) => <div className="workflow-step" key={step}><span className="num">{index + 1}</span><div><strong>{step}</strong><p className="subtle">{[8, 5, 3, 2][index]} khách</p></div></div>)}</div></div><div className="card pad"><h3>Công cụ chủ nhà đang bật</h3><p className="subtle" style={{ marginTop: 8 }}>Theo dõi lịch xem, phản hồi khách thuê, nhắc cọc và chuẩn bị hợp đồng cho nhà đang quản lý.</p><div className="actions" style={{ marginTop: 18 }}><RouteButton to="/web/messages" navigate={navigate}>Xem trao đổi</RouteButton><RouteButton className="btn secondary" to="/web/post" navigate={navigate}>Đăng tin mới</RouteButton></div></div></section></main>;
}

function PostPage({ navigate }: NavigateProps) {
  const { notify } = useRentCity();
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); notify("Đã lưu tin nháp. Chuyển sang Owner Center."); navigate("/web/owner"); }
  return <main className="page"><span className="eyebrow">Đăng tin</span><h1 style={{ fontSize: 44 }}>Đăng nhà cho thuê</h1><form className="section card pad" onSubmit={submit}><div className="grid cols-2"><label className="field"><span>Tên nhà</span><input required placeholder="Ví dụ: Studio mới gần Crescent Mall" /></label><label className="field"><span>Giá thuê</span><input required placeholder="5.8tr/tháng" /></label><label className="field"><span>Quận</span><select><option>Quận 7</option><option>Bình Thạnh</option><option>Thủ Đức</option></select></label><label className="field"><span>Diện tích</span><input required placeholder="28m2" /></label></div><label className="field" style={{ marginTop: 14 }}><span>Mô tả</span><textarea placeholder="Nội thất, cọc, điện nước, lịch trống..." /></label><div className="actions" style={{ marginTop: 18 }}><button className="btn" type="submit">Lưu tin nháp</button><RouteButton className="btn secondary" to="/web/owner" navigate={navigate}>Quản lý tin</RouteButton></div></form></main>;
}

function AccountPage({ navigate }: NavigateProps) {
  const { state, dispatch, notify } = useRentCity();
  return <main className="page"><span className="eyebrow">Tài khoản</span><h1 style={{ fontSize: 44 }}>Thông tin cá nhân</h1><section className="section grid cols-2"><div className="card pad"><h3>Đăng nhập OTP</h3><label className="field" style={{ marginTop: 16 }}><span>Số điện thoại</span><input defaultValue="+84 912 345 678" /></label><div className="actions" style={{ marginTop: 18 }}><button className="btn" onClick={() => { dispatch({ type: "otp/send" }); notify("Đã gửi OTP demo."); }}>Gửi mã OTP</button><RouteButton className="btn secondary" to="/web/saved" navigate={navigate}>Xem nhà đã lưu</RouteButton></div></div><div className="card pad"><h3>Thông báo</h3><div className="grid" style={{ marginTop: 14 }}>{state.notifications.map((item) => <p className="card pad subtle" key={item}>{item}</p>)}</div></div></section></main>;
}
