import assert from "node:assert/strict";
import test from "node:test";
import { HttpException, HttpStatus } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { PrismaService } from "../src/database/prisma.service";
import type { SmsProvider } from "../src/integrations/sms/sms-provider.interface";
import { AuthService } from "../src/modules/auth/auth.service";

function createConfig(values: Record<string, unknown>): ConfigService {
  return {
    get: <T>(key: string, defaultValue?: T) => (values[key] ?? defaultValue) as T
  } as ConfigService;
}

function createJwtService(token = "access_token"): JwtService {
  return {
    signAsync: async () => token
  } as unknown as JwtService;
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

test("auth service refreshes access token and rotates refresh secret", async () => {
  let updatePayload: unknown;
  const refreshTokenHash = await bcrypt.hash("old-secret", 10);
  const expiresAt = new Date(Date.now() + 60_000);
  const prisma = {
    authSession: {
      findUnique: async () => ({
        id: "session_1",
        refreshTokenHash,
        expiresAt,
        revokedAt: null,
        user: {
          id: "user_1",
          phone: "+84912345678",
          role: UserRole.TENANT,
          fullName: null
        }
      }),
      update: async (payload: unknown) => {
        updatePayload = payload;
        return { id: "session_1" };
      }
    }
  } as unknown as PrismaService;
  const service = new AuthService(prisma, createJwtService(), createConfig({}), {} as SmsProvider);

  const result = await service.refresh("session_1.old-secret");

  assert.equal(result.accessToken, "access_token");
  assert.match(result.refreshToken, /^session_1\./);
  assert.notEqual(result.refreshToken, "session_1.old-secret");
  assert.equal(result.refreshExpiresAt, expiresAt.toISOString());
  assert.deepEqual((updatePayload as { where: unknown }).where, { id: "session_1" });
});

test("auth service logout revokes refresh session", async () => {
  let revokePayload: unknown;
  const prisma = {
    authSession: {
      updateMany: async (payload: unknown) => {
        revokePayload = payload;
        return { count: 1 };
      }
    }
  } as unknown as PrismaService;
  const service = new AuthService(prisma, createJwtService(), createConfig({}), {} as SmsProvider);

  const result = await service.logout("session_1.secret");

  assert.equal(result.success, true);
  assert.deepEqual((revokePayload as { where: unknown }).where, {
    id: "session_1",
    revokedAt: null
  });
});
