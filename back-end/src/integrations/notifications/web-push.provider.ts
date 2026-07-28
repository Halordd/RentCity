import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import webPush from "web-push";
import { DeliveryResult } from "./email-provider.interface";
import { PushProvider, SendPushInput } from "./push-provider.interface";

@Injectable()
export class WebPushProvider implements PushProvider {
  constructor(private readonly config: ConfigService) {
    if (this.config.get<string>("PUSH_PROVIDER") === "web-push") {
      webPush.setVapidDetails(
        this.required("VAPID_SUBJECT"),
        this.required("VAPID_PUBLIC_KEY"),
        this.required("VAPID_PRIVATE_KEY")
      );
    }
  }

  async send(input: SendPushInput): Promise<DeliveryResult> {
    const response = await webPush.sendNotification(
      input.subscription as webPush.PushSubscription,
      JSON.stringify({
        title: input.title,
        body: input.body,
        payload: input.payload ?? {}
      })
    );

    return {
      provider: "web-push",
      messageId: `${response.statusCode}`
    };
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} is required when PUSH_PROVIDER=web-push.`);

    return value;
  }
}
