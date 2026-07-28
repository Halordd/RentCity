import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendOtpInput, SendOtpResult, SendTextInput, SmsProvider } from "./sms-provider.interface";

@Injectable()
export class LocalSmsProvider implements SmsProvider {
  constructor(private readonly config: ConfigService) {}

  async sendOtp(input: SendOtpInput): Promise<SendOtpResult> {
    return this.sendText({
      phone: input.phone,
      body: `RentCity OTP: ${input.code}. Ma co hieu luc trong ${Math.ceil(input.ttlSeconds / 60)} phut.`
    });
  }

  async sendText(input: SendTextInput): Promise<SendOtpResult> {
    const provider = this.config.get<string>("SMS_PROVIDER", "local");

    return {
      provider,
      messageId: `local-${input.phone}-${Date.now()}`
    };
  }
}
