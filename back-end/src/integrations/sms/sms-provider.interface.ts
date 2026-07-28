export type SendOtpInput = {
  phone: string;
  code: string;
  ttlSeconds: number;
};

export type SendOtpResult = {
  provider: string;
  messageId?: string;
};

export type SendTextInput = {
  phone: string;
  body: string;
};

export interface SmsProvider {
  sendOtp(input: SendOtpInput): Promise<SendOtpResult>;
  sendText(input: SendTextInput): Promise<SendOtpResult>;
}

export const SMS_PROVIDER = Symbol("SMS_PROVIDER");
