import assert from "node:assert/strict";
import test from "node:test";
import { validateEnv } from "../src/config/env.validation";

const baseEnv = {
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/rentcity?schema=public",
  JWT_SECRET: "test-secret"
};

test("env validation parses safe defaults", () => {
  const env = validateEnv(baseEnv);

  assert.equal(env.PORT, 4000);
  assert.equal(env.JWT_EXPIRES_IN, "7d");
  assert.equal(env.OTP_TTL_SECONDS, 300);
  assert.equal(env.OTP_REQUEST_LIMIT_PER_HOUR, 5);
});

test("env validation rejects weak production JWT secret", () => {
  assert.throws(
    () => validateEnv({ ...baseEnv, NODE_ENV: "production", JWT_SECRET: "change-me", PAYMENT_WEBHOOK_SECRET: "secret" }),
    /JWT_SECRET/
  );
});

test("env validation requires payment webhook secret in production", () => {
  assert.throws(() => validateEnv({ ...baseEnv, NODE_ENV: "production" }), /PAYMENT_WEBHOOK_SECRET/);
});

test("env validation rejects invalid frontend origins", () => {
  assert.throws(() => validateEnv({ ...baseEnv, FRONTEND_ORIGINS: "not-a-url" }), /FRONTEND_ORIGINS/);
});
