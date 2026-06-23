import { Injectable } from "@nestjs/common";

@Injectable()
export class BookingsService {
  availability(listingId: string) {
    return {
      listingId,
      slots: [
        { date: "2026-06-27", time: "09:00 - 11:00" },
        { date: "2026-06-27", time: "14:30 - 16:00" }
      ]
    };
  }

  create(payload: Record<string, unknown>) {
    return {
      id: "booking-demo",
      status: "PENDING_OWNER",
      ...payload
    };
  }

  updateStatus(id: string, status: string, payload: Record<string, unknown> = {}) {
    return {
      id,
      status,
      ...payload
    };
  }
}
