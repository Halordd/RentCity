import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendOtpInput, SendOtpResult, SendTextInput, SmsProvider } from "./sms-provider.interface";

type ZaloZnsResponse = {
  message_id?: string;
  error?: number;
  message?: string;
};

@Injectable()
export class ZaloZnsSmsProvider implements SmsProvider {
  constructor(private readonly config: ConfigService) {}

  async sendOtp(input: SendOtpInput): Promise<SendOtpResult> {
    const endpoint = this.config.get<string>("ZALO_ZNS_API_URL", "https://business.openapi.zalo.me/message/template");
    const accessToken = this.required("ZALO_ZNS_ACCESS_TOKEN");
    const templateId = this.required("ZALO_ZNS_OTP_TEMPLATE_ID");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        access_token: accessToken,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        phone: input.phone,
        template_id: templateId,
        template_data: {
          otp: input.code,
          ttl_minutes: Math.ceil(input.ttlSeconds / 60)
        },
        tracking_id: `rentcity-otp-${Date.now()}`
      })
    });
    const payload = (await response.json().catch(() => ({}))) as ZaloZnsResponse;

    if (!response.ok || (payload.error && payload.error !== 0)) {
      throw new Error(`Zalo ZNS OTP failed: ${payload.message ?? response.statusText}`);
    }

    return {
      provider: "zalo",
      messageId: payload.message_id
    };
  }

  async sendText(input: SendTextInput): Promise<SendOtpResult> {
    const endpoint = this.config.get<string>("ZALO_ZNS_API_URL", "https://business.openapi.zalo.me/message/template");
    const accessToken = this.required("ZALO_ZNS_ACCESS_TOKEN");
    const templateId = this.required("ZALO_ZNS_TEXT_TEMPLATE_ID");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        access_token: accessToken,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        phone: input.phone,
        template_id: templateId,
        template_data: {
          message: input.body
        },
        tracking_id: `rentcity-message-${Date.now()}`
      })
    });
    const payload = (await response.json().catch(() => ({}))) as ZaloZnsResponse;

    if (!response.ok || (payload.error && payload.error !== 0)) {
      throw new Error(`Zalo ZNS message failed: ${payload.message ?? response.statusText}`);
    }

    return {
      provider: "zalo",
      messageId: payload.message_id
    };
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} is required when SMS_PROVIDER=zalo.`);

    return value;
  }
}
