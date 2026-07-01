import type { Booking } from "../types";
import { http } from "../api/httpClient";
import { mapApiBooking, nextApiBookingDate, type ApiBooking } from "./apiMappers";

export interface CreateBookingInput {
  listingId: string;
  date?: FormDataEntryValue | null;
  time?: FormDataEntryValue | null;
  note?: FormDataEntryValue | null;
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

export async function createBookingRemote({ listingId, date, time, note }: CreateBookingInput): Promise<Booking> {
  const result = await http.post<ApiBooking>("/bookings", {
    listingId,
    date: nextApiBookingDate(date),
    timeSlot: String(time || "09:00 - 11:00"),
    note: note ? String(note) : undefined
  });
  return mapApiBooking(result);
}

export const bookingsService = {
  createBooking,
  createBookingRemote,
  async myBookingsRemote(): Promise<Booking[]> {
    const result = await http.get<{ items: ApiBooking[] }>("/me/bookings");
    return result.items.map(mapApiBooking);
  },
  availabilityRemote(listingId: string): Promise<{ listingId: string; slots: Array<{ date: string; time: string; available: boolean }> }> {
    return http.get(`/listings/${listingId}/availability`);
  },
  async rescheduleRemote(id: string, input: Pick<CreateBookingInput, "date" | "time">): Promise<Booking> {
    const result = await http.patch<ApiBooking>(`/bookings/${id}/reschedule`, {
      date: nextApiBookingDate(input.date),
      timeSlot: String(input.time || "09:00 - 11:00")
    });
    return mapApiBooking(result);
  },
  async cancelRemote(id: string): Promise<Booking> {
    const result = await http.patch<ApiBooking>(`/bookings/${id}/cancel`);
    return mapApiBooking(result);
  }
};
