export type CreateDepositIntentInput = {
  reference: string;
  amount: number;
  currency: string;
  provider?: string;
  description?: string;
};

export type PaymentIntent = {
  provider: string;
  reference: string;
  checkoutUrl?: string;
  expiresAt?: string;
};

export interface PaymentGateway {
  createDepositIntent(input: CreateDepositIntentInput): Promise<PaymentIntent>;
}

export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");
