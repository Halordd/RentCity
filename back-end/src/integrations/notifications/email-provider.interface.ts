export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
};

export type DeliveryResult = {
  provider: string;
  messageId?: string;
};

export interface EmailProvider {
  send(input: SendEmailInput): Promise<DeliveryResult>;
}

export const EMAIL_PROVIDER = Symbol("EMAIL_PROVIDER");
