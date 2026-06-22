export function createBooking({ listingId, date, time }) {
  return {
    id: `BK-${Date.now().toString().slice(-4)}`,
    listingId,
    date: date || "Thứ 7, 22/06",
    time: time || "09:00 - 11:00",
    status: "Chờ chủ nhà xác nhận"
  };
}
