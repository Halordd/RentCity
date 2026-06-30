import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { RateLimitHitInput, RateLimitHitResult, RateLimitStore } from "./rate-limit-store.interface";

@Injectable()
export class RedisRateLimitStore implements RateLimitStore, OnModuleDestroy {
  private client?: Redis;

  constructor(private readonly config: ConfigService) {}

  async hit(input: RateLimitHitInput): Promise<RateLimitHitResult> {
    const client = this.getClient();
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
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }

  private getClient(): Redis {
    if (!this.client) {
      const redisUrl = this.config.get<string>("REDIS_URL");
      if (!redisUrl) throw new Error("REDIS_URL is required for RedisRateLimitStore.");

      this.client = new Redis(redisUrl, {
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1
      });
    }

    return this.client;
  }
}
