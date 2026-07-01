import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendOtpInput, SendOtpResult, SmsProvider } from "./sms-provider.interface";

@Injectable()
export class LocalSmsProvider implements SmsProvider {
  constructor(private readonly config: ConfigService) {}

  async sendOtp(input: SendOtpInput): Promise<SendOtpResult> {
    const provider = this.config.get<string>("SMS_PROVIDER", "local");

    return {
      provider,
      messageId: `local-${input.phone}-${Date.now()}`
    };
  }
}
