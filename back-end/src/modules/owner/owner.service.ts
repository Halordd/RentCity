import { Injectable } from "@nestjs/common";

@Injectable()
export class OwnerService {
  listings() {
    return { items: [] };
  }

  createListing(payload: Record<string, unknown>) {
    return { id: "listing-draft", status: "DRAFT", ...payload };
  }

  updateListing(id: string, payload: Record<string, unknown>) {
    return { id, ...payload };
  }

  addImage(id: string, payload: Record<string, unknown>) {
    return { listingId: id, image: payload };
  }

  bookings() {
    return { items: [] };
  }

  confirmBooking(id: string) {
    return { id, status: "CONFIRMED" };
  }
}
