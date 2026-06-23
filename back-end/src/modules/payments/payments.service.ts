import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentsService {
  createDeposit(payload: Record<string, unknown>) {
    return { id: "payment-demo", status: "PENDING", ...payload };
  }

  detail(id: string) {
    return { id, amount: 5800000, currency: "VND", status: "PENDING" };
  }

  webhook(payload: Record<string, unknown>) {
    return { received: true, payload };
  }
}
