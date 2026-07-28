import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Buffer } from "node:buffer";
import { SendOtpInput, SendOtpResult, SendTextInput, SmsProvider } from "./sms-provider.interface";

type TwilioMessageResponse = {
  sid?: string;
  message?: string;
};

@Injectable()
export class TwilioSmsProvider implements SmsProvider {
  constructor(private readonly config: ConfigService) {}

  async sendOtp(input: SendOtpInput): Promise<SendOtpResult> {
    return this.sendText({
      phone: input.phone,
      body: `RentCity OTP: ${input.code}. Ma co hieu luc trong ${Math.ceil(input.ttlSeconds / 60)} phut.`
    });
  }

  async sendText(input: SendTextInput): Promise<SendOtpResult> {
    const accountSid = this.required("TWILIO_ACCOUNT_SID");
    const authToken = this.required("TWILIO_AUTH_TOKEN");
    const from = this.required("TWILIO_FROM_NUMBER");
    const body = new URLSearchParams({
      To: input.phone,
      From: from,
      Body: input.body
    });
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      body
    });
    const payload = (await response.json().catch(() => ({}))) as TwilioMessageResponse;

    if (!response.ok) {
      throw new Error(`Twilio SMS failed: ${payload.message ?? response.statusText}`);
    }

    return {
      provider: "twilio",
      messageId: payload.sid
    };
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} is required when SMS_PROVIDER=twilio.`);

    return value;
  }
}
