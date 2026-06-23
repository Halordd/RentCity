import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationsService {
  appState() {
    return {
      savedListingIds: ["studio-nguyen-van-cu"],
      unreadCount: 1,
      lastPaymentStatus: "PENDING"
    };
  }

  updateAppState(payload: Record<string, unknown>) {
    return { saved: true, payload };
  }

  createPushSubscription(payload: Record<string, unknown>) {
    return { id: "push-demo", ...payload };
  }
}
