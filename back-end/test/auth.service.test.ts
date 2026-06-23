import assert from "node:assert/strict";
import test from "node:test";
import { HttpException, HttpStatus } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { JwtService } from "@nestjs/jwt";
import type { PrismaService } from "../src/database/prisma.service";
import type { SmsProvider } from "../src/integrations/sms/sms-provider.interface";
import { AuthService } from "../src/modules/auth/auth.service";

function createConfig(values: Record<string, unknown>): ConfigService {
  return {
    get: <T>(key: string, defaultValue?: T) => (values[key] ?? defaultValue) as T
  } as ConfigService;
}

test("auth service rate-limits OTP requests per phone number", async () => {
  const prisma = {
    otpChallenge: {
      count: async () => 5,
      create: async () => {
        throw new Error("OTP should not be created when rate limit is exceeded");
      }
    }
  } as unknown as PrismaService;
  const smsProvider = {
    sendOtp: async () => {
      throw new Error("SMS provider should not be called when rate limit is exceeded");
    }
  } as SmsProvider;
  const service = new AuthService(prisma, {} as JwtService, createConfig({ OTP_REQUEST_LIMIT_PER_HOUR: 5 }), smsProvider);

  await assert.rejects(
    () => service.requestOtp("+84912345678"),
    (error) => error instanceof HttpException && error.getStatus() === HttpStatus.TOO_MANY_REQUESTS
  );
});

test("auth service hides dev OTP code in production", async () => {
  let sentOtpPhone: string | undefined;
  const prisma = {
    otpChallenge: {
      count: async () => 0,
      create: async () => ({ id: "otp_1" })
    }
  } as unknown as PrismaService;
  const smsProvider = {
    sendOtp: async (input) => {
      sentOtpPhone = input.phone;
      return { provider: "local", messageId: "message_1" };
    }
  } satisfies SmsProvider;
  const service = new AuthService(
    prisma,
    {} as JwtService,
    createConfig({ NODE_ENV: "production", OTP_TTL_SECONDS: 300, OTP_REQUEST_LIMIT_PER_HOUR: 5 }),
    smsProvider
  );

  const result = await service.requestOtp("+84912345678");

  assert.equal(result.delivery, "sms");
  assert.equal(result.provider, "local");
  assert.equal(result.messageId, "message_1");
  assert.equal(sentOtpPhone, "+84912345678");
  assert.equal("devCode" in result, false);
});
