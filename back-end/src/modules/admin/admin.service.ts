import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminService {
  metrics() {
    return {
      listingsPendingReview: 6,
      verificationsPending: 4,
      disputesOpen: 2,
      paymentIssues: 1
    };
  }

  verifications() {
    return {
      items: [{ id: "verification-demo", ownerName: "Anh Minh Nguyen", status: "PENDING" }]
    };
  }

  setVerificationStatus(id: string, status: string) {
    return { id, status };
  }

  reviewListing(id: string, payload: { status: string; note?: string }) {
    return { id, ...payload };
  }

  disputes() {
    return { items: [] };
  }

  updateDispute(id: string, payload: Record<string, unknown>) {
    return { id, ...payload };
  }

  auditLogs() {
    return { items: [] };
  }
}
