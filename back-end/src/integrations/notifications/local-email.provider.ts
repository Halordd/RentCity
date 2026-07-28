import { Injectable } from "@nestjs/common";
import { DeliveryResult, EmailProvider, SendEmailInput } from "./email-provider.interface";

@Injectable()
export class LocalEmailProvider implements EmailProvider {
  async send(input: SendEmailInput): Promise<DeliveryResult> {
    return {
      provider: "local",
      messageId: `local-email-${input.to}-${Date.now()}`
    };
  }
}
