import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "node:crypto";
import { CreateDepositIntentInput, PaymentGateway, PaymentIntent } from "./payment-gateway.interface";

@Injectable()
export class VnpayPaymentGateway implements PaymentGateway {
  constructor(private readonly config: ConfigService) {}

  async createDepositIntent(input: CreateDepositIntentInput): Promise<PaymentIntent> {
    const paymentUrl = new URL(this.config.get<string>("VNPAY_PAYMENT_URL", "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"));
    const createdAt = this.formatDate(new Date());
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const params: Record<string, string> = {
      vnp_Amount: String(input.amount * 100),
      vnp_Command: "pay",
      vnp_CreateDate: createdAt,
      vnp_CurrCode: input.currency,
      vnp_ExpireDate: this.formatDate(expiresAt),
      vnp_IpAddr: this.config.get<string>("VNPAY_DEFAULT_IP", "127.0.0.1"),
      vnp_Locale: "vn",
      vnp_OrderInfo: input.description || `RentCity deposit ${input.reference}`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: this.required("VNPAY_RETURN_URL"),
      vnp_TmnCode: this.required("VNPAY_TMN_CODE"),
      vnp_TxnRef: input.reference,
      vnp_Version: "2.1.0"
    };
    const signData = this.buildEncodedQuery(params);
    const secureHash = createHmac("sha512", this.required("VNPAY_HASH_SECRET")).update(signData).digest("hex");

    for (const [key, value] of Object.entries(params).sort(([left], [right]) => left.localeCompare(right))) {
      paymentUrl.searchParams.set(key, value);
    }
    paymentUrl.searchParams.set("vnp_SecureHash", secureHash);

    return {
      provider: "vnpay",
      reference: input.reference,
      checkoutUrl: paymentUrl.toString(),
      expiresAt: expiresAt.toISOString()
    };
  }

  private buildEncodedQuery(params: Record<string, string>): string {
    return Object.entries(params)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value).replace(/%20/g, "+")}`)
      .join("&");
  }

  private formatDate(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, "0");
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} is required when PAYMENT_PROVIDER=vnpay.`);

    return value;
  }
}
