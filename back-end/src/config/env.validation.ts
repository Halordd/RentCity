type Env = Record<string, string | undefined>;
type ValidatedEnv = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  PORT: number;
  FRONTEND_ORIGINS: string;
  OTP_TTL_SECONDS: number;
  OTP_REQUEST_LIMIT_PER_HOUR: number;
  PAYMENT_WEBHOOK_SECRET?: string;
  UPLOAD_PUBLIC_BASE_URL?: string;
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

function parsePositiveInteger(value: string, key: string): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${key} must be a positive integer.`);
  }

  return parsed;
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

export function validateEnv(env: Env): ValidatedEnv {
  const databaseUrl = required(env, "DATABASE_URL");
  const jwtSecret = required(env, "JWT_SECRET");
  const jwtExpiresIn = env.JWT_EXPIRES_IN?.trim() || "7d";
  const frontendOrigins = env.FRONTEND_ORIGINS?.trim() || "";
  const nodeEnv = env.NODE_ENV?.trim();

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

  if (env.REDIS_URL) {
    assertUrl(env.REDIS_URL, "REDIS_URL");
  }

  return {
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: jwtExpiresIn,
    PORT: parsePort(env.PORT?.trim() || "4000"),
    FRONTEND_ORIGINS: frontendOrigins,
    OTP_TTL_SECONDS: parseSeconds(env.OTP_TTL_SECONDS?.trim() || "300"),
    OTP_REQUEST_LIMIT_PER_HOUR: parsePositiveInteger(env.OTP_REQUEST_LIMIT_PER_HOUR?.trim() || "5", "OTP_REQUEST_LIMIT_PER_HOUR"),
    PAYMENT_WEBHOOK_SECRET: env.PAYMENT_WEBHOOK_SECRET?.trim(),
    UPLOAD_PUBLIC_BASE_URL: env.UPLOAD_PUBLIC_BASE_URL?.trim(),
    REDIS_URL: env.REDIS_URL?.trim(),
    NODE_ENV: nodeEnv
  };
}
