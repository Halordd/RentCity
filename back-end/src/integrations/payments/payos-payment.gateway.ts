import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateDepositIntentInput, PaymentGateway, PaymentIntent } from "./payment-gateway.interface";
import { hmacSha256Hex, sortedQuery } from "./payment-signing";

type PayosCreatePaymentResponse = {
  data?: {
    checkoutUrl?: string;
    paymentLinkId?: string;
  };
  desc?: string;
};

@Injectable()
export class PayosPaymentGateway implements PaymentGateway {
  constructor(private readonly config: ConfigService) {}

  async createDepositIntent(input: CreateDepositIntentInput): Promise<PaymentIntent> {
    const endpoint = this.config.get<string>("PAYOS_API_URL", "https://api-merchant.payos.vn/v2/payment-requests");
    const orderCode = this.orderCode(input.reference);
    const returnUrl = this.required("PAYOS_RETURN_URL");
    const cancelUrl = this.required("PAYOS_CANCEL_URL");
    const description = (input.description || `RentCity ${input.reference}`).slice(0, 25);
    const requestBody = {
      orderCode,
      amount: input.amount,
      description,
      returnUrl,
      cancelUrl,
      signature: hmacSha256Hex(
        this.required("PAYOS_CHECKSUM_KEY"),
        sortedQuery({
          amount: input.amount,
          cancelUrl,
          description,
          orderCode,
          returnUrl
        })
      )
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-client-id": this.required("PAYOS_CLIENT_ID"),
        "x-api-key": this.required("PAYOS_API_KEY")
      },
      body: JSON.stringify(requestBody)
    });
    const payload = (await response.json().catch(() => ({}))) as PayosCreatePaymentResponse;

    if (!response.ok || !payload.data?.checkoutUrl) {
      throw new Error(`payOS payment link failed: ${payload.desc ?? response.statusText}`);
    }

    return {
      provider: "payos",
      reference: input.reference,
      checkoutUrl: payload.data.checkoutUrl,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };
  }

  private orderCode(reference: string): number {
    const digits = reference.replace(/\D/g, "").slice(-12);
    return Number(digits || Date.now().toString().slice(-12));
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} is required when PAYMENT_PROVIDER=payos.`);

    return value;
  }
}
