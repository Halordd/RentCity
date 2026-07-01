import assert from "node:assert/strict";
import test from "node:test";
import type { ConfigService } from "@nestjs/config";
import { RedisRateLimitStore } from "../src/integrations/rate-limit/redis-rate-limit.store";

function createConfig(values: Record<string, string>): ConfigService {
  return {
    get: <T>(key: string) => values[key] as T
  } as ConfigService;
}

test("redis rate limit store falls back to memory when redis is unavailable", async () => {
  const store = new RedisRateLimitStore(createConfig({ REDIS_URL: "redis://127.0.0.1:1" }));
  const input = {
    key: `test:rate-limit:${Date.now()}`,
    limit: 1,
    windowSeconds: 60
  };

  const first = await store.hit(input);
  const second = await store.hit(input);
  await store.onModuleDestroy();

  assert.equal(first.blocked, false);
  assert.equal(second.blocked, true);
});
