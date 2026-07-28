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
  REDIS_URL?: string;
  NODE_ENV?: string;
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
    REDIS_URL: env.REDIS_URL?.trim(),
    NODE_ENV: nodeEnv
  };
}
