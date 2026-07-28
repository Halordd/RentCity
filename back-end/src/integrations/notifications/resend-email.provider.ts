import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DeliveryResult, EmailProvider, SendEmailInput } from "./email-provider.interface";

type ResendResponse = {
  id?: string;
  message?: string;
};

@Injectable()
export class ResendEmailProvider implements EmailProvider {
  constructor(private readonly config: ConfigService) {}

  async send(input: SendEmailInput): Promise<DeliveryResult> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.required("RESEND_API_KEY")}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        from: this.required("EMAIL_FROM"),
        to: input.to,
        subject: input.subject,
        text: input.text
      })
    });
    const payload = (await response.json().catch(() => ({}))) as ResendResponse;

    if (!response.ok) {
      throw new Error(`Resend email failed: ${payload.message ?? response.statusText}`);
    }

    return {
      provider: "resend",
      messageId: payload.id
    };
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} is required when EMAIL_PROVIDER=resend.`);

    return value;
  }
}
