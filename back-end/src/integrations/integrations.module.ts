import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalPaymentGateway } from "./payments/local-payment.gateway";
import { PAYMENT_GATEWAY } from "./payments/payment-gateway.interface";
import { MemoryRateLimitStore } from "./rate-limit/memory-rate-limit.store";
import { RATE_LIMIT_STORE } from "./rate-limit/rate-limit-store.interface";
import { RedisRateLimitStore } from "./rate-limit/redis-rate-limit.store";
import { LocalSmsProvider } from "./sms/local-sms.provider";
import { SMS_PROVIDER } from "./sms/sms-provider.interface";
import { LocalStorageProvider } from "./storage/local-storage.provider";
import { S3StorageProvider } from "./storage/s3-storage.provider";
import { STORAGE_PROVIDER } from "./storage/storage-provider.interface";

@Module({
  providers: [
    LocalSmsProvider,
    LocalPaymentGateway,
    LocalStorageProvider,
    S3StorageProvider,
    MemoryRateLimitStore,
    RedisRateLimitStore,
    {
      provide: SMS_PROVIDER,
      useExisting: LocalSmsProvider
    },
    {
      provide: PAYMENT_GATEWAY,
      useExisting: LocalPaymentGateway
    },
    {
      provide: STORAGE_PROVIDER,
      inject: [ConfigService, LocalStorageProvider, S3StorageProvider],
      useFactory: (config: ConfigService, localStorage: LocalStorageProvider, s3Storage: S3StorageProvider) =>
        config.get<string>("STORAGE_PROVIDER") === "s3" ? s3Storage : localStorage
    },
    {
      provide: RATE_LIMIT_STORE,
      inject: [ConfigService, RedisRateLimitStore, MemoryRateLimitStore],
      useFactory: (config: ConfigService, redisStore: RedisRateLimitStore, memoryStore: MemoryRateLimitStore) =>
        config.get<string>("REDIS_URL") ? redisStore : memoryStore
    }
  ],
  exports: [SMS_PROVIDER, PAYMENT_GATEWAY, STORAGE_PROVIDER, RATE_LIMIT_STORE]
})
export class IntegrationsModule {}
