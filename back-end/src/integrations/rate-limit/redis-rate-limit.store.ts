import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { MemoryRateLimitStore } from "./memory-rate-limit.store";
import { RateLimitHitInput, RateLimitHitResult, RateLimitStore } from "./rate-limit-store.interface";

@Injectable()
export class RedisRateLimitStore implements RateLimitStore, OnModuleDestroy {
  private readonly fallbackStore = new MemoryRateLimitStore();
  private readonly logger = new Logger(RedisRateLimitStore.name);
  private client?: Redis;
  private lastFallbackWarningAt = 0;

  constructor(private readonly config: ConfigService) {}

  async hit(input: RateLimitHitInput): Promise<RateLimitHitResult> {
    try {
      const client = await this.getReadyClient();
      const count = await client.incr(input.key);

      if (count === 1) {
        await client.expire(input.key, input.windowSeconds);
      }

      const ttl = await client.ttl(input.key);
      const resetAt = new Date(Date.now() + Math.max(ttl, 0) * 1000);

      return {
        key: input.key,
        limit: input.limit,
        remaining: Math.max(input.limit - count, 0),
        resetAt,
        blocked: count > input.limit
      };
    } catch (error) {
      this.warnFallback(error);
      return this.fallbackStore.hit(input);
    }
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }

  private async getReadyClient(): Promise<Redis> {
    const client = this.getClient();

    if (client.status === "wait" || client.status === "close" || client.status === "end") {
      await client.connect();
    }

    return client;
  }

  private getClient(): Redis {
    if (!this.client) {
      const redisUrl = this.config.get<string>("REDIS_URL");
      if (!redisUrl) throw new Error("REDIS_URL is required for RedisRateLimitStore.");

      this.client = new Redis(redisUrl, {
        connectTimeout: 1000,
        enableOfflineQueue: true,
        lazyConnect: true,
        maxRetriesPerRequest: 1
      });
      this.client.on("error", (error) => this.warnFallback(error));
    }

    return this.client;
  }

  private warnFallback(error: unknown): void {
    const now = Date.now();
    if (now - this.lastFallbackWarningAt < 60_000) return;

    this.lastFallbackWarningAt = now;
    const message = error instanceof Error ? error.message : "Unknown Redis error";
    this.logger.warn(`Redis rate limit store unavailable, using memory fallback: ${message}`);
  }
}
