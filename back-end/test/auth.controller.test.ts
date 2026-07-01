import assert from "node:assert/strict";
import test from "node:test";
import type { AuthService } from "../src/modules/auth/auth.service";
import { AuthController } from "../src/modules/auth/auth.controller";

test("auth controller awaits OTP request before wrapping the response", async () => {
  const controller = new AuthController({
    requestOtp: async (phone: string) => ({
      phone,
      delivery: "sms",
      provider: "local",
      messageId: "message_1",
      ttlSeconds: 300,
      devCode: "123456"
    })
  } as AuthService);

  const result = await controller.requestOtp({ phone: "+84912345678" });

  assert.deepEqual(result, {
    data: {
      phone: "+84912345678",
      delivery: "sms",
      provider: "local",
      messageId: "message_1",
      ttlSeconds: 300,
      devCode: "123456"
    }
  });
});
