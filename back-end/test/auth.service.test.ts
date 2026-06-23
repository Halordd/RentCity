import assert from "node:assert/strict";
import test from "node:test";
import { HttpException, HttpStatus } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { JwtService } from "@nestjs/jwt";
import type { PrismaService } from "../src/database/prisma.service";
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
  const service = new AuthService(prisma, {} as JwtService, createConfig({ OTP_REQUEST_LIMIT_PER_HOUR: 5 }));

  await assert.rejects(
    () => service.requestOtp("+84912345678"),
    (error) => error instanceof HttpException && error.getStatus() === HttpStatus.TOO_MANY_REQUESTS
  );
});

test("auth service hides dev OTP code in production", async () => {
  const prisma = {
    otpChallenge: {
      count: async () => 0,
      create: async () => ({ id: "otp_1" })
    }
  } as unknown as PrismaService;
  const service = new AuthService(
    prisma,
    {} as JwtService,
    createConfig({ NODE_ENV: "production", OTP_TTL_SECONDS: 300, OTP_REQUEST_LIMIT_PER_HOUR: 5 })
  );

  const result = await service.requestOtp("+84912345678");

  assert.equal(result.delivery, "sms");
  assert.equal("devCode" in result, false);
});
