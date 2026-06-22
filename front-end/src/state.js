const storeKey = "rentcity.production.state";
export let state = loadState();
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

export function persist() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}
