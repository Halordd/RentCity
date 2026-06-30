export type RateLimitHitInput = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitHitResult = {
  key: string;
  limit: number;
  remaining: number;
  resetAt: Date;
  blocked: boolean;
};

export interface RateLimitStore {
  hit(input: RateLimitHitInput): Promise<RateLimitHitResult>;
}

export const RATE_LIMIT_STORE = Symbol("RATE_LIMIT_STORE");
