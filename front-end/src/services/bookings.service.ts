import type { Booking } from "../types";

interface CreateBookingInput {
  listingId: string;
  date?: FormDataEntryValue | null;
  time?: FormDataEntryValue | null;
}

export function createBooking({ listingId, date, time }: CreateBookingInput): Booking {
  return {
    id: `BK-${Date.now().toString().slice(-4)}`,
    listingId,
    date: String(date || "Thứ 7, 22/06"),
    time: String(time || "09:00 - 11:00"),
    status: "Chờ chủ nhà xác nhận"
  };
}
