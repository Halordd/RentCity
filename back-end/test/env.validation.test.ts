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
    TWILIO_ACCOUNT_SID: "AC123",
    TWILIO_AUTH_TOKEN: "token",
    TWILIO_FROM_NUMBER: "+15551234",
    PAYMENT_PROVIDER: "payos",
    PAYOS_CLIENT_ID: "client-id",
    PAYOS_API_KEY: "api-key",
    PAYOS_CHECKSUM_KEY: "checksum-key",
    PAYOS_RETURN_URL: "https://rentcity.test/payments/return",
    PAYOS_CANCEL_URL: "https://rentcity.test/payments/cancel",
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

test("env validation requires Twilio settings when SMS provider is twilio", () => {
  assert.throws(() => validateEnv({ ...baseEnv, SMS_PROVIDER: "twilio" }), /TWILIO_ACCOUNT_SID/);
});

test("env validation parses Twilio SMS settings", () => {
  const env = validateEnv({
    ...baseEnv,
    SMS_PROVIDER: "twilio",
    TWILIO_ACCOUNT_SID: "AC123",
    TWILIO_AUTH_TOKEN: "token",
    TWILIO_FROM_NUMBER: "+15551234"
  });

  assert.equal(env.SMS_PROVIDER, "twilio");
  assert.equal(env.TWILIO_ACCOUNT_SID, "AC123");
});

test("env validation requires Zalo ZNS settings when SMS provider is zalo", () => {
  assert.throws(() => validateEnv({ ...baseEnv, SMS_PROVIDER: "zalo" }), /ZALO_ZNS_ACCESS_TOKEN/);
});

test("env validation requires PayOS settings when payment provider is payos", () => {
  assert.throws(() => validateEnv({ ...baseEnv, PAYMENT_PROVIDER: "payos" }), /PAYOS_CLIENT_ID/);
});

test("env validation parses PayOS payment settings", () => {
  const env = validateEnv({
    ...baseEnv,
    PAYMENT_PROVIDER: "payos",
    PAYOS_CLIENT_ID: "client-id",
    PAYOS_API_KEY: "api-key",
    PAYOS_CHECKSUM_KEY: "checksum-key",
    PAYOS_RETURN_URL: "https://rentcity.test/payments/return",
    PAYOS_CANCEL_URL: "https://rentcity.test/payments/cancel"
  });

  assert.equal(env.PAYMENT_PROVIDER, "payos");
  assert.equal(env.PAYOS_CLIENT_ID, "client-id");
});

test("env validation requires MoMo settings when payment provider is momo", () => {
  assert.throws(() => validateEnv({ ...baseEnv, PAYMENT_PROVIDER: "momo" }), /MOMO_PARTNER_CODE/);
});

test("env validation requires VNPay settings when payment provider is vnpay", () => {
  assert.throws(() => validateEnv({ ...baseEnv, PAYMENT_PROVIDER: "vnpay" }), /VNPAY_TMN_CODE/);
});

test("env validation requires Google Maps API key when map provider is google", () => {
  assert.throws(() => validateEnv({ ...baseEnv, MAP_PROVIDER: "google" }), /GOOGLE_MAPS_API_KEY/);
});

test("env validation requires Nominatim contact email when map provider is nominatim", () => {
  assert.throws(() => validateEnv({ ...baseEnv, MAP_PROVIDER: "nominatim" }), /NOMINATIM_CONTACT_EMAIL/);
});

test("env validation requires Resend settings when email provider is resend", () => {
  assert.throws(() => validateEnv({ ...baseEnv, EMAIL_PROVIDER: "resend" }), /RESEND_API_KEY/);
});

test("env validation requires VAPID settings when push provider is web-push", () => {
  assert.throws(() => validateEnv({ ...baseEnv, PUSH_PROVIDER: "web-push" }), /VAPID_SUBJECT/);
});

test("env validation rejects invalid VAPID subject", () => {
  assert.throws(
    () => validateEnv({
      ...baseEnv,
      PUSH_PROVIDER: "web-push",
      VAPID_SUBJECT: "ftp://invalid",
      VAPID_PUBLIC_KEY: "public",
      VAPID_PRIVATE_KEY: "private"
    }),
    /VAPID_SUBJECT/
  );
});

test("env validation parses web push settings", () => {
  const env = validateEnv({
    ...baseEnv,
    PUSH_PROVIDER: "web-push",
    VAPID_SUBJECT: "mailto:admin@rentcity.test",
    VAPID_PUBLIC_KEY: "public-key",
    VAPID_PRIVATE_KEY: "private-key"
  });

  assert.equal(env.PUSH_PROVIDER, "web-push");
  assert.equal(env.VAPID_SUBJECT, "mailto:admin@rentcity.test");
});

test("env validation rejects invalid S3 server-side encryption", () => {
  assert.throws(
    () => validateEnv({
      ...baseEnv,
      STORAGE_PROVIDER: "s3",
      S3_BUCKET: "bucket",
      S3_REGION: "us-east-1",
      S3_ACCESS_KEY_ID: "key",
      S3_SECRET_ACCESS_KEY: "secret",
      S3_PUBLIC_BASE_URL: "https://cdn.test/uploads",
      S3_SERVER_SIDE_ENCRYPTION: "invalid"
    }),
    /S3_SERVER_SIDE_ENCRYPTION/
  );
});
