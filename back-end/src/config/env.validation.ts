type Env = Record<string, string | undefined>;
type ValidatedEnv = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REFRESH_TOKEN_TTL_DAYS: number;
  PORT: number;
  FRONTEND_ORIGINS: string;
  OTP_TTL_SECONDS: number;
  OTP_REQUEST_LIMIT_PER_HOUR: number;
  SMS_PROVIDER: string;
  PAYMENT_PROVIDER: string;
  STORAGE_PROVIDER: string;
  MAP_PROVIDER: string;
  EMAIL_PROVIDER: string;
  PUSH_PROVIDER: string;
  API_DOCS_ENABLED: boolean;
  PAYMENT_WEBHOOK_SECRET?: string;
  LOCAL_PAYMENT_CHECKOUT_BASE_URL?: string;
  UPLOAD_PUBLIC_BASE_URL?: string;
  S3_BUCKET?: string;
  S3_REGION?: string;
  S3_ENDPOINT?: string;
  S3_ACCESS_KEY_ID?: string;
  S3_SECRET_ACCESS_KEY?: string;
  S3_PUBLIC_BASE_URL?: string;
  S3_FORCE_PATH_STYLE: boolean;
  S3_UPLOAD_EXPIRES_SECONDS: number;
  S3_SERVER_SIDE_ENCRYPTION?: string;
  S3_PRIVATE_READ_EXPIRES_SECONDS: number;
  REDIS_URL?: string;
  NODE_ENV?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
  ZALO_ZNS_ACCESS_TOKEN?: string;
  ZALO_ZNS_OTP_TEMPLATE_ID?: string;
  ZALO_ZNS_TEXT_TEMPLATE_ID?: string;
  PAYOS_CLIENT_ID?: string;
  PAYOS_API_KEY?: string;
  PAYOS_CHECKSUM_KEY?: string;
  PAYOS_RETURN_URL?: string;
  PAYOS_CANCEL_URL?: string;
  MOMO_PARTNER_CODE?: string;
  MOMO_ACCESS_KEY?: string;
  MOMO_SECRET_KEY?: string;
  MOMO_RETURN_URL?: string;
  MOMO_IPN_URL?: string;
  VNPAY_TMN_CODE?: string;
  VNPAY_HASH_SECRET?: string;
  VNPAY_RETURN_URL?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  VAPID_SUBJECT?: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  GOOGLE_MAPS_API_KEY?: string;
  NOMINATIM_CONTACT_EMAIL?: string;
};

function required(env: Env, key: keyof ValidatedEnv): string {
  const value = env[key];

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
}

function parsePort(value: string): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function parseSeconds(value: string): number {
  const seconds = Number(value);
  if (!Number.isInteger(seconds) || seconds < 60 || seconds > 3600) {
    throw new Error("OTP_TTL_SECONDS must be an integer between 60 and 3600.");
  }

  return seconds;
}

function parseUploadExpiresSeconds(value: string): number {
  const seconds = Number(value);
  if (!Number.isInteger(seconds) || seconds < 60 || seconds > 3600) {
    throw new Error("S3_UPLOAD_EXPIRES_SECONDS must be an integer between 60 and 3600.");
  }

  return seconds;
}

function parsePositiveInteger(value: string, key: string): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${key} must be a positive integer.`);
  }

  return parsed;
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (!value) return defaultValue;

  const normalized = value.toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;

  throw new Error("Boolean environment variables must use true/false, 1/0, yes/no, or on/off.");
}

function assertUrl(value: string, key: string): void {
  try {
    new URL(value);
  } catch {
    throw new Error(`${key} must be a valid URL.`);
  }
}

function assertOrigins(value: string): void {
  for (const origin of value.split(",").map((item) => item.trim()).filter(Boolean)) {
    assertUrl(origin, "FRONTEND_ORIGINS");
  }
}

function assertStorageProviderEnv(env: Env, provider: string): void {
  if (!["local", "s3"].includes(provider)) {
    throw new Error("STORAGE_PROVIDER must be either local or s3.");
  }

  if (provider !== "s3") return;

  required(env, "S3_BUCKET");
  required(env, "S3_REGION");
  required(env, "S3_ACCESS_KEY_ID");
  required(env, "S3_SECRET_ACCESS_KEY");
  const publicBaseUrl = required(env, "S3_PUBLIC_BASE_URL");

  assertUrl(publicBaseUrl, "S3_PUBLIC_BASE_URL");

  if (env.S3_ENDPOINT) {
    assertUrl(env.S3_ENDPOINT, "S3_ENDPOINT");
  }

  const sse = env.S3_SERVER_SIDE_ENCRYPTION?.trim();
  if (sse && !["AES256", "aws:kms"].includes(sse)) {
    throw new Error("S3_SERVER_SIDE_ENCRYPTION must be either AES256 or aws:kms.");
  }
}

function assertSmsProviderEnv(env: Env, provider: string): void {
  if (!["local", "twilio", "zalo"].includes(provider)) {
    throw new Error("SMS_PROVIDER must be either local, twilio, or zalo.");
  }

  if (provider === "twilio") {
    required(env, "TWILIO_ACCOUNT_SID");
    required(env, "TWILIO_AUTH_TOKEN");
    required(env, "TWILIO_FROM_NUMBER");
  }

  if (provider === "zalo") {
    required(env, "ZALO_ZNS_ACCESS_TOKEN");
    required(env, "ZALO_ZNS_OTP_TEMPLATE_ID");
  }
}

function assertPaymentProviderEnv(env: Env, provider: string): void {
  if (!["local", "payos", "momo", "vnpay"].includes(provider)) {
    throw new Error("PAYMENT_PROVIDER must be either local, payos, momo, or vnpay.");
  }

  if (provider === "payos") {
    required(env, "PAYOS_CLIENT_ID");
    required(env, "PAYOS_API_KEY");
    required(env, "PAYOS_CHECKSUM_KEY");
    const returnUrl = required(env, "PAYOS_RETURN_URL");
    const cancelUrl = required(env, "PAYOS_CANCEL_URL");
    assertUrl(returnUrl, "PAYOS_RETURN_URL");
    assertUrl(cancelUrl, "PAYOS_CANCEL_URL");
  }

  if (provider === "momo") {
    required(env, "MOMO_PARTNER_CODE");
    required(env, "MOMO_ACCESS_KEY");
    required(env, "MOMO_SECRET_KEY");
    const returnUrl = required(env, "MOMO_RETURN_URL");
    const ipnUrl = required(env, "MOMO_IPN_URL");
    assertUrl(returnUrl, "MOMO_RETURN_URL");
    assertUrl(ipnUrl, "MOMO_IPN_URL");
  }

  if (provider === "vnpay") {
    required(env, "VNPAY_TMN_CODE");
    required(env, "VNPAY_HASH_SECRET");
    const returnUrl = required(env, "VNPAY_RETURN_URL");
    assertUrl(returnUrl, "VNPAY_RETURN_URL");
  }
}

function assertMapProviderEnv(env: Env, provider: string): void {
  if (!["local", "google", "nominatim"].includes(provider)) {
    throw new Error("MAP_PROVIDER must be either local, google, or nominatim.");
  }

  if (provider === "google") {
    required(env, "GOOGLE_MAPS_API_KEY");
  }

  if (provider === "nominatim") {
    required(env, "NOMINATIM_CONTACT_EMAIL");
  }
}

function assertEmailProviderEnv(env: Env, provider: string): void {
  if (!["local", "resend"].includes(provider)) {
    throw new Error("EMAIL_PROVIDER must be either local or resend.");
  }

  if (provider === "resend") {
    required(env, "RESEND_API_KEY");
    required(env, "EMAIL_FROM");
  }
}

function assertPushProviderEnv(env: Env, provider: string): void {
  if (!["local", "web-push"].includes(provider)) {
    throw new Error("PUSH_PROVIDER must be either local or web-push.");
  }

  if (provider === "web-push") {
    required(env, "VAPID_SUBJECT");
    required(env, "VAPID_PUBLIC_KEY");
    required(env, "VAPID_PRIVATE_KEY");
    const subject = env.VAPID_SUBJECT?.trim();
    if (subject && !subject.startsWith("https://") && !subject.startsWith("mailto:")) {
      throw new Error("VAPID_SUBJECT must be a HTTPS URL or mailto: email address.");
    }
  }
}

export function validateEnv(env: Env): ValidatedEnv {
  const databaseUrl = required(env, "DATABASE_URL");
  const jwtSecret = required(env, "JWT_SECRET");
  const jwtExpiresIn = env.JWT_EXPIRES_IN?.trim() || "7d";
  const frontendOrigins = env.FRONTEND_ORIGINS?.trim() || "";
  const nodeEnv = env.NODE_ENV?.trim();
  const smsProvider = env.SMS_PROVIDER?.trim() || "local";
  const paymentProvider = env.PAYMENT_PROVIDER?.trim() || "local";
  const storageProvider = env.STORAGE_PROVIDER?.trim() || "local";
  const mapProvider = env.MAP_PROVIDER?.trim() || "local";
  const emailProvider = env.EMAIL_PROVIDER?.trim() || "local";
  const pushProvider = env.PUSH_PROVIDER?.trim() || "local";

  assertUrl(databaseUrl, "DATABASE_URL");

  if (nodeEnv === "production" && jwtSecret === "change-me") {
    throw new Error("JWT_SECRET must be changed before running in production.");
  }

  if (nodeEnv === "production" && !env.PAYMENT_WEBHOOK_SECRET?.trim()) {
    throw new Error("PAYMENT_WEBHOOK_SECRET is required in production.");
  }

  if (frontendOrigins) {
    assertOrigins(frontendOrigins);
  }

  if (env.UPLOAD_PUBLIC_BASE_URL) {
    assertUrl(env.UPLOAD_PUBLIC_BASE_URL, "UPLOAD_PUBLIC_BASE_URL");
  }

  if (env.LOCAL_PAYMENT_CHECKOUT_BASE_URL) {
    assertUrl(env.LOCAL_PAYMENT_CHECKOUT_BASE_URL, "LOCAL_PAYMENT_CHECKOUT_BASE_URL");
  }

  assertStorageProviderEnv(env, storageProvider);
  assertSmsProviderEnv(env, smsProvider);
  assertPaymentProviderEnv(env, paymentProvider);
  assertMapProviderEnv(env, mapProvider);
  assertEmailProviderEnv(env, emailProvider);
  assertPushProviderEnv(env, pushProvider);

  if (env.REDIS_URL) {
    assertUrl(env.REDIS_URL, "REDIS_URL");
  }

  return {
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: jwtExpiresIn,
    REFRESH_TOKEN_TTL_DAYS: parsePositiveInteger(env.REFRESH_TOKEN_TTL_DAYS?.trim() || "30", "REFRESH_TOKEN_TTL_DAYS"),
    PORT: parsePort(env.PORT?.trim() || "4000"),
    FRONTEND_ORIGINS: frontendOrigins,
    OTP_TTL_SECONDS: parseSeconds(env.OTP_TTL_SECONDS?.trim() || "300"),
    OTP_REQUEST_LIMIT_PER_HOUR: parsePositiveInteger(env.OTP_REQUEST_LIMIT_PER_HOUR?.trim() || "5", "OTP_REQUEST_LIMIT_PER_HOUR"),
    SMS_PROVIDER: smsProvider,
    PAYMENT_PROVIDER: paymentProvider,
    STORAGE_PROVIDER: storageProvider,
    MAP_PROVIDER: mapProvider,
    EMAIL_PROVIDER: emailProvider,
    PUSH_PROVIDER: pushProvider,
    API_DOCS_ENABLED: parseBoolean(env.API_DOCS_ENABLED, nodeEnv !== "production"),
    PAYMENT_WEBHOOK_SECRET: env.PAYMENT_WEBHOOK_SECRET?.trim(),
    LOCAL_PAYMENT_CHECKOUT_BASE_URL: env.LOCAL_PAYMENT_CHECKOUT_BASE_URL?.trim(),
    UPLOAD_PUBLIC_BASE_URL: env.UPLOAD_PUBLIC_BASE_URL?.trim(),
    S3_BUCKET: env.S3_BUCKET?.trim(),
    S3_REGION: env.S3_REGION?.trim(),
    S3_ENDPOINT: env.S3_ENDPOINT?.trim(),
    S3_ACCESS_KEY_ID: env.S3_ACCESS_KEY_ID?.trim(),
    S3_SECRET_ACCESS_KEY: env.S3_SECRET_ACCESS_KEY?.trim(),
    S3_PUBLIC_BASE_URL: env.S3_PUBLIC_BASE_URL?.trim(),
    S3_FORCE_PATH_STYLE: parseBoolean(env.S3_FORCE_PATH_STYLE, false),
    S3_UPLOAD_EXPIRES_SECONDS: parseUploadExpiresSeconds(env.S3_UPLOAD_EXPIRES_SECONDS?.trim() || "600"),
    S3_SERVER_SIDE_ENCRYPTION: env.S3_SERVER_SIDE_ENCRYPTION?.trim(),
    S3_PRIVATE_READ_EXPIRES_SECONDS: parsePositiveInteger(env.S3_PRIVATE_READ_EXPIRES_SECONDS?.trim() || "300", "S3_PRIVATE_READ_EXPIRES_SECONDS"),
    REDIS_URL: env.REDIS_URL?.trim(),
    NODE_ENV: nodeEnv,
    TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID?.trim(),
    TWILIO_AUTH_TOKEN: env.TWILIO_AUTH_TOKEN?.trim(),
    TWILIO_FROM_NUMBER: env.TWILIO_FROM_NUMBER?.trim(),
    ZALO_ZNS_ACCESS_TOKEN: env.ZALO_ZNS_ACCESS_TOKEN?.trim(),
    ZALO_ZNS_OTP_TEMPLATE_ID: env.ZALO_ZNS_OTP_TEMPLATE_ID?.trim(),
    ZALO_ZNS_TEXT_TEMPLATE_ID: env.ZALO_ZNS_TEXT_TEMPLATE_ID?.trim(),
    PAYOS_CLIENT_ID: env.PAYOS_CLIENT_ID?.trim(),
    PAYOS_API_KEY: env.PAYOS_API_KEY?.trim(),
    PAYOS_CHECKSUM_KEY: env.PAYOS_CHECKSUM_KEY?.trim(),
    PAYOS_RETURN_URL: env.PAYOS_RETURN_URL?.trim(),
    PAYOS_CANCEL_URL: env.PAYOS_CANCEL_URL?.trim(),
    MOMO_PARTNER_CODE: env.MOMO_PARTNER_CODE?.trim(),
    MOMO_ACCESS_KEY: env.MOMO_ACCESS_KEY?.trim(),
    MOMO_SECRET_KEY: env.MOMO_SECRET_KEY?.trim(),
    MOMO_RETURN_URL: env.MOMO_RETURN_URL?.trim(),
    MOMO_IPN_URL: env.MOMO_IPN_URL?.trim(),
    VNPAY_TMN_CODE: env.VNPAY_TMN_CODE?.trim(),
    VNPAY_HASH_SECRET: env.VNPAY_HASH_SECRET?.trim(),
    VNPAY_RETURN_URL: env.VNPAY_RETURN_URL?.trim(),
    RESEND_API_KEY: env.RESEND_API_KEY?.trim(),
    EMAIL_FROM: env.EMAIL_FROM?.trim(),
    VAPID_SUBJECT: env.VAPID_SUBJECT?.trim(),
    VAPID_PUBLIC_KEY: env.VAPID_PUBLIC_KEY?.trim(),
    VAPID_PRIVATE_KEY: env.VAPID_PRIVATE_KEY?.trim(),
    GOOGLE_MAPS_API_KEY: env.GOOGLE_MAPS_API_KEY?.trim(),
    NOMINATIM_CONTACT_EMAIL: env.NOMINATIM_CONTACT_EMAIL?.trim()
  };
}
