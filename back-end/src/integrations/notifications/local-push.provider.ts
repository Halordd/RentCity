import { Injectable } from "@nestjs/common";
import { DeliveryResult } from "./email-provider.interface";
import { PushProvider, SendPushInput } from "./push-provider.interface";

@Injectable()
export class LocalPushProvider implements PushProvider {
  async send(input: SendPushInput): Promise<DeliveryResult> {
    return {
      provider: "local",
      messageId: `local-push-${input.subscription.endpoint}-${Date.now()}`
    };
  }
}
