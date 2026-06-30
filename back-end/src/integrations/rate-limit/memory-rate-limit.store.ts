import { Injectable } from "@nestjs/common";
import { RateLimitHitInput, RateLimitHitResult, RateLimitStore } from "./rate-limit-store.interface";

type Counter = {
  count: number;
  resetAt: number;
};

@Injectable()
export class MemoryRateLimitStore implements RateLimitStore {
  private readonly counters = new Map<string, Counter>();

  async hit(input: RateLimitHitInput): Promise<RateLimitHitResult> {
    const now = Date.now();
    const existing = this.counters.get(input.key);
    const counter = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + input.windowSeconds * 1000 };

    counter.count += 1;
    this.counters.set(input.key, counter);

    return {
      key: input.key,
      limit: input.limit,
      remaining: Math.max(input.limit - counter.count, 0),
      resetAt: new Date(counter.resetAt),
      blocked: counter.count > input.limit
    };
  }
}
