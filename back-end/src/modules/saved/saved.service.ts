import { Injectable } from "@nestjs/common";

@Injectable()
export class SavedService {
  list() {
    return {
      items: ["studio-nguyen-van-cu"]
    };
  }

  save(listingId: string) {
    return { listingId, saved: true };
  }

  remove(listingId: string) {
    return { listingId, saved: false };
  }
}
