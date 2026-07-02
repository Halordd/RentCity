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
  assert.equal(env.REFRESH_TOKEN_TTL_DAYS, 30);
  assert.equal(env.OTP_TTL_SECONDS, 300);
  assert.equal(env.OTP_REQUEST_LIMIT_PER_HOUR, 5);
  assert.equal(env.API_DOCS_ENABLED, true);
  assert.equal(env.SMS_PROVIDER, "local");
  assert.equal(env.PAYMENT_PROVIDER, "local");
  assert.equal(env.STORAGE_PROVIDER, "local");
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

test("env validation parses provider and API docs flags", () => {
  const env = validateEnv({
    ...baseEnv,
    API_DOCS_ENABLED: "false",
    SMS_PROVIDER: "twilio",
    PAYMENT_PROVIDER: "payos",
    STORAGE_PROVIDER: "local",
    LOCAL_PAYMENT_CHECKOUT_BASE_URL: "http://localhost:4000/pay"
  });

  assert.equal(env.API_DOCS_ENABLED, false);
  assert.equal(env.SMS_PROVIDER, "twilio");
  assert.equal(env.PAYMENT_PROVIDER, "payos");
  assert.equal(env.STORAGE_PROVIDER, "local");
  assert.equal(env.LOCAL_PAYMENT_CHECKOUT_BASE_URL, "http://localhost:4000/pay");
});

test("env validation rejects unsupported storage providers", () => {
  assert.throws(() => validateEnv({ ...baseEnv, STORAGE_PROVIDER: "aws" }), /STORAGE_PROVIDER/);
});

test("env validation requires S3 settings when S3 storage is selected", () => {
  assert.throws(() => validateEnv({ ...baseEnv, STORAGE_PROVIDER: "s3" }), /S3_BUCKET/);
});

test("env validation parses S3 storage settings", () => {
  const env = validateEnv({
    ...baseEnv,
    STORAGE_PROVIDER: "s3",
    S3_BUCKET: "rentcity-uploads",
    S3_REGION: "ap-southeast-1",
    S3_ENDPOINT: "http://localhost:9000",
    S3_ACCESS_KEY_ID: "access-key",
    S3_SECRET_ACCESS_KEY: "secret-key",
    S3_PUBLIC_BASE_URL: "https://cdn.rentcity.test/uploads",
    S3_FORCE_PATH_STYLE: "true",
    S3_UPLOAD_EXPIRES_SECONDS: "900"
  });

  assert.equal(env.STORAGE_PROVIDER, "s3");
  assert.equal(env.S3_BUCKET, "rentcity-uploads");
  assert.equal(env.S3_REGION, "ap-southeast-1");
  assert.equal(env.S3_ENDPOINT, "http://localhost:9000");
  assert.equal(env.S3_PUBLIC_BASE_URL, "https://cdn.rentcity.test/uploads");
  assert.equal(env.S3_FORCE_PATH_STYLE, true);
  assert.equal(env.S3_UPLOAD_EXPIRES_SECONDS, 900);
});
