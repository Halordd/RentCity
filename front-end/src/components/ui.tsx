import type { ButtonHTMLAttributes, FormEvent, ReactNode } from "react";
import { isApiConfigured } from "../api/httpClient";
import { money } from "../utils";
import { listingsService } from "../services/listings.service";
import { savedListingsService } from "../services/saved.service";
import { useRentCity } from "../app/useRentCity";
import type { Listing, NavigateTo } from "../types";

interface BrandProps {
  to?: string;
  admin?: boolean;
  navigate: NavigateTo;
}

interface RouteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to: string;
  navigate: NavigateTo;
  children: ReactNode;
}

interface SearchFormProps {
  compact?: boolean;
  targetRoute?: string;
  navigate: NavigateTo;
}

interface ListingCardProps {
  item: Listing;
  variant?: "web" | "mobile";
  baseRoute?: string;
  navigate: NavigateTo;
}

interface EmptyStateProps {
  title: string;
  body: string;
}

interface PhoneShellProps {
  active?: string;
  baseRoute?: string;
  webApp?: boolean;
  navigate: NavigateTo;
  children: ReactNode;
}

export function Brand({ to = "/web", admin = false, navigate }: BrandProps) {
  return (
    <button className={`brand ${admin ? "admin-brand" : ""}`} onClick={() => navigate(to)} aria-label="RentCity home">
      <span className="brand-mark" aria-hidden="true" />
      {admin ? (
        <span>
          <strong>RentCity</strong>
          <small>Admin Console</small>
        </span>
      ) : (
        <span>RentCity</span>
      )}
    </button>
  );
}

export function RouteButton({ to, navigate, className = "btn", children, ...props }: RouteButtonProps) {
  return (
    <button className={className} type="button" onClick={() => navigate(to)} {...props}>
      {children}
    </button>
  );
}

export function WebTopbar({ navigate }: { navigate: NavigateTo }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Brand navigate={navigate} />
        <nav className="nav" aria-label="RentCity sections">
          <RouteButton className="active" to="/web/search" navigate={navigate}>Tìm thuê</RouteButton>
          <RouteButton className="" to="/web/post" navigate={navigate}>Cho thuê</RouteButton>
          <RouteButton className="" to="/web/owner" navigate={navigate}>Quản lý nhà</RouteButton>
          <RouteButton className="" to="/web/payments" navigate={navigate}>Thanh toán</RouteButton>
          <RouteButton className="" to="/web/messages" navigate={navigate}>Tin nhắn</RouteButton>
        </nav>
      </div>
    </header>
  );
}

export function Footer({ navigate }: { navigate: NavigateTo }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>RentCity</strong>
          <p className="subtle" style={{ marginTop: 12 }}>Nền tảng tìm trọ, thuê nhà và quản lý bất động sản cho thuê.</p>
        </div>
        <div>
          <strong>Sản phẩm</strong>
          <button onClick={() => navigate("/web/search")}>Tìm thuê</button>
          <button onClick={() => navigate("/web/post")}>Đăng tin</button>
          <button onClick={() => navigate("/web/owner")}>Quản lý nhà</button>
        </div>
        <div>
          <strong>Công ty</strong>
          <button>Về RentCity</button>
          <button>Đối tác</button>
          <button>Tin tức</button>
        </div>
        <div>
          <strong>Hỗ trợ</strong>
          <button onClick={() => navigate("/web/messages")}>Trợ giúp</button>
          <button onClick={() => navigate("/web/saved")}>Nhà đã lưu</button>
          <button onClick={() => navigate("/app")}>Ứng dụng mobile</button>
        </div>
      </div>
    </footer>
  );
}

export function SearchForm({ compact = false, targetRoute = "/web/search", navigate }: SearchFormProps) {
  const { state, dispatch } = useRentCity();
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch({
      type: "filters/set",
      payload: {
        keyword: String(data.get("keyword") || ""),
        district: String(data.get("district") || "Tất cả"),
        budget: String(data.get("budget") || "Tất cả")
      }
    });
    navigate(targetRoute);
  }

  return (
    <form className="search-panel" onSubmit={onSubmit}>
      <div className="search-grid">
        <label className="field">
          <span>Từ khóa</span>
          <input name="keyword" defaultValue={state.filters.keyword} placeholder="Nhập khu vực, tên đường, tiện ích" />
        </label>
        <label className="field">
          <span>Quận</span>
          <select name="district" defaultValue={state.filters.district}>
            {["Tất cả", "Quận 7", "Bình Thạnh", "Thủ Đức"].map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Ngân sách</span>
          <select name="budget" defaultValue={state.filters.budget}>
            {["Tất cả", "Dưới 6tr", "6-10tr", "Trên 10tr"].map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <button className="btn" type="submit">{compact ? "Tìm" : "Tìm nhà"}</button>
      </div>
    </form>
  );
}

export function ListingCard({ item, variant = "web", baseRoute = "/app", navigate }: ListingCardProps) {
  const { state, dispatch, notify } = useRentCity();
  const saved = state.saved.includes(item.id);
  const toggleSave = () => {
    dispatch({ type: "saved/toggle", payload: item.id });
    notify(saved ? "Đã bỏ lưu." : "Đã lưu nhà.");
    if (isApiConfigured() && state.auth) {
      const request = saved ? savedListingsService.removeRemote(item.id) : savedListingsService.saveRemote(item.id);
      void request.catch(() => {
        dispatch({ type: "saved/toggle", payload: item.id });
        notify("Chưa đồng bộ được nhà đã lưu với backend.");
      });
    }
  };

  if (variant === "mobile") {
    return (
      <article className="mobile-card">
        <img src={item.image} alt={item.title} />
        <div className="inner">
          <div className="listing-title">
            <h3>{item.title}</h3>
            <button className="icon-btn" onClick={toggleSave} aria-label="Lưu nhà">{saved ? "✓" : "+"}</button>
          </div>
          <p className="subtle">{item.district} · {item.area}m2 · {item.deposit}</p>
          <p className="price" style={{ marginTop: 10 }}>{money(item.price)}</p>
          <div className="chip-row" style={{ marginTop: 12 }}>
            {item.tags.slice(0, 2).map((tag) => <span className="chip" key={tag}>{tag}</span>)}
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <RouteButton to={`${baseRoute}/listing/${item.id}`} navigate={navigate}>Xem</RouteButton>
            <button className="btn secondary" type="button" onClick={toggleSave}>{saved ? "Đã lưu" : "Lưu"}</button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card listing-card">
      <img src={item.image} alt={item.title} />
      <div>
        <div className="listing-title">
          <h3>{item.title}</h3>
          <span className="price">{money(item.price)}</span>
        </div>
        <p className="subtle" style={{ marginTop: 8 }}>{item.address} · {item.district} · {item.area}m2</p>
        <div className="chip-row" style={{ marginTop: 14 }}>
          <span className="chip">{item.rooms} phòng ngủ</span>
          <span className="chip blue">{item.deposit}</span>
          <span className="chip amber">{item.electricity}</span>
        </div>
      </div>
      <div className="actions" style={{ alignContent: "start", justifyContent: "flex-end" }}>
        <button className="icon-btn" onClick={toggleSave} aria-label="Lưu nhà">{saved ? "✓" : "+"}</button>
        <RouteButton to={`/web/listing/${item.id}`} navigate={navigate}>Chi tiết</RouteButton>
      </div>
    </article>
  );
}

export function ListingTile({ item, navigate }: { item: Listing; navigate: NavigateTo }) {
  const { state, dispatch, notify } = useRentCity();
  const saved = state.saved.includes(item.id);
  return (
    <article className="card">
      <img src={item.image} alt={item.title} style={{ height: 190, width: "100%", objectFit: "cover" }} />
      <div className="pad">
        <h3>{item.title}</h3>
        <p className="subtle" style={{ marginTop: 8 }}>{item.district} · {item.area}m2</p>
        <p className="price" style={{ marginTop: 12 }}>{money(item.price)}</p>
        <div className="actions" style={{ marginTop: 14 }}>
          <RouteButton to={`/web/listing/${item.id}`} navigate={navigate}>Xem chi tiết</RouteButton>
          <button className="btn secondary" type="button" onClick={() => { dispatch({ type: "saved/toggle", payload: item.id }); notify(saved ? "Đã bỏ lưu." : "Đã lưu nhà."); }}>
            {saved ? "Đã lưu" : "Lưu"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function MapPanel({ navigate }: { navigate: NavigateTo }) {
  const { state } = useRentCity();
  const featured = listingsService.featured(state.listings);
  return (
    <aside className="card map-card">
      <div className="listing-title">
        <h3>Bản đồ khu vực</h3>
        <span className="chip blue">Bản đồ khu vực</span>
      </div>
      <div className="map-art" style={{ marginTop: 16 }}>
        <span className="road" style={{ left: 34, top: 70, width: "82%", height: 7 }} />
        <span className="road" style={{ left: 72, top: 148, width: "70%", height: 7 }} />
        <span className="road" style={{ left: 38, top: 226, width: "78%", height: 7 }} />
        <span className="road" style={{ left: 150, top: 34, width: 7, height: 250 }} />
        <span className="road" style={{ left: 276, top: 64, width: 7, height: 220 }} />
        <button className="pin" style={{ left: 118, top: 172 }} onClick={() => navigate("/web/listing/studio-q7")} aria-label="Studio mới" />
        <button className="pin blue" style={{ left: 262, top: 128 }} onClick={() => navigate("/web/listing/can-ho-1pn")} aria-label="Căn hộ 1PN" />
        <button className="pin amber" style={{ left: 76, top: 230 }} onClick={() => navigate("/web/listing/phong-tro-an-ninh")} aria-label="Phòng trọ" />
      </div>
      <div className="grid" style={{ marginTop: 16 }}>
        {featured.map((item) => (
          <button className="card pad" key={item.id} onClick={() => navigate(`/web/listing/${item.id}`)} style={{ textAlign: "left" }}>
            <strong>{item.title}</strong>
            <p className="subtle">{item.district} · {money(item.price)}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  );
}

export function PhoneShell({ active, baseRoute = "/app", webApp = false, navigate, children }: PhoneShellProps) {
  const nav = webApp
    ? [["dashboard", "Home"], ["search", "Tìm"], ["manage", "Quản lý"], ["bookings", "Lịch"], ["profile", "Tôi"]]
    : [["home", "Home"], ["search", "Tìm"], ["saved", "Lưu"], ["bookings", "Lịch"], ["profile", "Tôi"]];
  const activeKey = active === "booking" ? "bookings" : ["saved", "messages", "payments", "account"].includes(active ?? "") ? "profile" : active;
  const contentClass = active === "messages" ? "phone-content phone-content-chat" : "phone-content";

  return (
    <section className={`phone ${webApp ? "webapp-phone" : ""}`} aria-label={`RentCity ${webApp ? "web app" : "app"}`}>
      {webApp && <div className="browser-bar"><span>rentcity.vn/app</span></div>}
      <header className="phone-header">
        <Brand to={baseRoute} navigate={navigate} />
        <button className="icon-btn" onClick={() => navigate(`${baseRoute}/profile`)} aria-label="Thông báo">!</button>
      </header>
      <div className={contentClass}>{children}</div>
      <nav className="bottom-nav">
        {nav.map(([key, label]) => {
          const route = key === "home" || key === "dashboard" ? baseRoute : `${baseRoute}/${key}`;
          return <button className={activeKey === key ? "active" : ""} key={key} onClick={() => navigate(route)}>{label}</button>;
        })}
      </nav>
    </section>
  );
}
