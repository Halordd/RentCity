import type { DeliveryResult } from "./email-provider.interface";

export type PushSubscriptionData = {
  endpoint: string;
  keys: Record<string, unknown>;
};

export type SendPushInput = {
  subscription: PushSubscriptionData;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
};

export interface PushProvider {
  send(input: SendPushInput): Promise<DeliveryResult>;
}

export const PUSH_PROVIDER = Symbol("PUSH_PROVIDER");
