import type { Booking } from "../types";
import { apiClient } from "../api/apiClient";
import type { CreateBookingDto, RescheduleBookingDto } from "../api/generated";
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
  const body: CreateBookingDto = {
    listingId,
    date: nextApiBookingDate(date),
    timeSlot: String(time || "09:00 - 11:00"),
    note: note ? String(note) : undefined
  };
  const result = await apiClient.post<ApiBooking>("POST /bookings", body);
  return mapApiBooking(result);
}

export const bookingsService = {
  createBooking,
  createBookingRemote,
  async myBookingsRemote(): Promise<Booking[]> {
    const result = await apiClient.get<{ items: ApiBooking[] }>("GET /me/bookings");
    return result.items.map(mapApiBooking);
  },
  availabilityRemote(listingId: string): Promise<{ listingId: string; slots: Array<{ date: string; time: string; available: boolean }> }> {
    return apiClient.get("GET /listings/{id}/availability", { params: { id: listingId } });
  },
  async rescheduleRemote(id: string, input: Pick<CreateBookingInput, "date" | "time">): Promise<Booking> {
    const body: RescheduleBookingDto = {
      date: nextApiBookingDate(input.date),
      timeSlot: String(input.time || "09:00 - 11:00")
    };
    const result = await apiClient.patch<ApiBooking>("PATCH /bookings/{id}/reschedule", body, { params: { id } });
    return mapApiBooking(result);
  },
  async cancelRemote(id: string): Promise<Booking> {
    const result = await apiClient.patch<ApiBooking>("PATCH /bookings/{id}/cancel", undefined, { params: { id } });
    return mapApiBooking(result);
  }
};
