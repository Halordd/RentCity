import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateDepositIntentInput, PaymentGateway, PaymentIntent } from "./payment-gateway.interface";
import { hmacSha256Hex } from "./payment-signing";

type MomoCreatePaymentResponse = {
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
  message?: string;
  resultCode?: number;
};

@Injectable()
export class MomoPaymentGateway implements PaymentGateway {
  constructor(private readonly config: ConfigService) {}

  async createDepositIntent(input: CreateDepositIntentInput): Promise<PaymentIntent> {
    const endpoint = this.config.get<string>("MOMO_ENDPOINT", "https://payment.momo.vn/v2/gateway/api/create");
    const partnerCode = this.required("MOMO_PARTNER_CODE");
    const accessKey = this.required("MOMO_ACCESS_KEY");
    const secretKey = this.required("MOMO_SECRET_KEY");
    const redirectUrl = this.required("MOMO_RETURN_URL");
    const ipnUrl = this.required("MOMO_IPN_URL");
    const requestId = input.reference;
    const orderId = input.reference.replace(/[^0-9a-zA-Z_.-]+/g, "-");
    const orderInfo = input.description || `RentCity deposit ${input.reference}`;
    const extraData = "";
    const requestType = "captureWallet";
    const rawSignature = [
      `accessKey=${accessKey}`,
      `amount=${input.amount}`,
      `extraData=${extraData}`,
      `ipnUrl=${ipnUrl}`,
      `orderId=${orderId}`,
      `orderInfo=${orderInfo}`,
      `partnerCode=${partnerCode}`,
      `redirectUrl=${redirectUrl}`,
      `requestId=${requestId}`,
      `requestType=${requestType}`
    ].join("&");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        partnerCode,
        partnerName: "RentCity",
        storeId: "RentCity",
        requestId,
        amount: input.amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang: "vi",
        requestType,
        extraData,
        signature: hmacSha256Hex(secretKey, rawSignature)
      })
    });
    const payload = (await response.json().catch(() => ({}))) as MomoCreatePaymentResponse;

    if (!response.ok || payload.resultCode !== 0 || !payload.payUrl) {
      throw new Error(`MoMo payment failed: ${payload.message ?? response.statusText}`);
    }

    return {
      provider: "momo",
      reference: input.reference,
      checkoutUrl: payload.payUrl,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} is required when PAYMENT_PROVIDER=momo.`);

    return value;
  }
}
