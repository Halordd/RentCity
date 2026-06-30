import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateDepositIntentInput, PaymentGateway, PaymentIntent } from "./payment-gateway.interface";

@Injectable()
export class LocalPaymentGateway implements PaymentGateway {
  constructor(private readonly config: ConfigService) {}

  async createDepositIntent(input: CreateDepositIntentInput): Promise<PaymentIntent> {
    const provider = input.provider || this.config.get<string>("PAYMENT_PROVIDER", "local");
    const checkoutBaseUrl = this.config.get<string>("LOCAL_PAYMENT_CHECKOUT_BASE_URL");

    return {
      provider,
      reference: input.reference,
      checkoutUrl: checkoutBaseUrl ? `${checkoutBaseUrl.replace(/\/$/, "")}/${input.reference}` : undefined,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };
  }
}
