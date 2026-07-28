import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GEOCODING_PROVIDER } from "./maps/geocoding-provider.interface";
import { GoogleGeocodingProvider } from "./maps/google-geocoding.provider";
import { LocalGeocodingProvider } from "./maps/local-geocoding.provider";
import { NominatimGeocodingProvider } from "./maps/nominatim-geocoding.provider";
import { EMAIL_PROVIDER } from "./notifications/email-provider.interface";
import { LocalEmailProvider } from "./notifications/local-email.provider";
import { LocalPushProvider } from "./notifications/local-push.provider";
import { PUSH_PROVIDER } from "./notifications/push-provider.interface";
import { ResendEmailProvider } from "./notifications/resend-email.provider";
import { WebPushProvider } from "./notifications/web-push.provider";
import { LocalPaymentGateway } from "./payments/local-payment.gateway";
import { MomoPaymentGateway } from "./payments/momo-payment.gateway";
import { PAYMENT_GATEWAY } from "./payments/payment-gateway.interface";
import { PayosPaymentGateway } from "./payments/payos-payment.gateway";
import { VnpayPaymentGateway } from "./payments/vnpay-payment.gateway";
import { MemoryRateLimitStore } from "./rate-limit/memory-rate-limit.store";
import { RATE_LIMIT_STORE } from "./rate-limit/rate-limit-store.interface";
import { RedisRateLimitStore } from "./rate-limit/redis-rate-limit.store";
import { LocalSmsProvider } from "./sms/local-sms.provider";
import { SMS_PROVIDER } from "./sms/sms-provider.interface";
import { TwilioSmsProvider } from "./sms/twilio-sms.provider";
import { ZaloZnsSmsProvider } from "./sms/zalo-zns-sms.provider";
import { LocalStorageProvider } from "./storage/local-storage.provider";
import { S3StorageProvider } from "./storage/s3-storage.provider";
import { STORAGE_PROVIDER } from "./storage/storage-provider.interface";

@Module({
  providers: [
    LocalSmsProvider,
    TwilioSmsProvider,
    ZaloZnsSmsProvider,
    LocalPaymentGateway,
    PayosPaymentGateway,
    MomoPaymentGateway,
    VnpayPaymentGateway,
    LocalStorageProvider,
    S3StorageProvider,
    LocalGeocodingProvider,
    GoogleGeocodingProvider,
    NominatimGeocodingProvider,
    LocalEmailProvider,
    ResendEmailProvider,
    LocalPushProvider,
    WebPushProvider,
    MemoryRateLimitStore,
    RedisRateLimitStore,
    {
      provide: SMS_PROVIDER,
      inject: [ConfigService, LocalSmsProvider, TwilioSmsProvider, ZaloZnsSmsProvider],
      useFactory: (config: ConfigService, localSms: LocalSmsProvider, twilioSms: TwilioSmsProvider, zaloSms: ZaloZnsSmsProvider) => {
        const provider = config.get<string>("SMS_PROVIDER", "local");
        if (provider === "twilio") return twilioSms;
        if (provider === "zalo") return zaloSms;
        return localSms;
      }
    },
    {
      provide: PAYMENT_GATEWAY,
      inject: [ConfigService, LocalPaymentGateway, PayosPaymentGateway, MomoPaymentGateway, VnpayPaymentGateway],
      useFactory: (
        config: ConfigService,
        localPayment: LocalPaymentGateway,
        payosPayment: PayosPaymentGateway,
        momoPayment: MomoPaymentGateway,
        vnpayPayment: VnpayPaymentGateway
      ) => {
        const provider = config.get<string>("PAYMENT_PROVIDER", "local");
        if (provider === "payos") return payosPayment;
        if (provider === "momo") return momoPayment;
        if (provider === "vnpay") return vnpayPayment;
        return localPayment;
      }
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
    },
    {
      provide: GEOCODING_PROVIDER,
      inject: [ConfigService, LocalGeocodingProvider, GoogleGeocodingProvider, NominatimGeocodingProvider],
      useFactory: (
        config: ConfigService,
        localGeocoding: LocalGeocodingProvider,
        googleGeocoding: GoogleGeocodingProvider,
        nominatimGeocoding: NominatimGeocodingProvider
      ) => {
        const provider = config.get<string>("MAP_PROVIDER", "local");
        if (provider === "google") return googleGeocoding;
        if (provider === "nominatim") return nominatimGeocoding;
        return localGeocoding;
      }
    },
    {
      provide: EMAIL_PROVIDER,
      inject: [ConfigService, LocalEmailProvider, ResendEmailProvider],
      useFactory: (config: ConfigService, localEmail: LocalEmailProvider, resendEmail: ResendEmailProvider) =>
        config.get<string>("EMAIL_PROVIDER", "local") === "resend" ? resendEmail : localEmail
    },
    {
      provide: PUSH_PROVIDER,
      inject: [ConfigService, LocalPushProvider, WebPushProvider],
      useFactory: (config: ConfigService, localPush: LocalPushProvider, webPushProvider: WebPushProvider) =>
        config.get<string>("PUSH_PROVIDER", "local") === "web-push" ? webPushProvider : localPush
    }
  ],
  exports: [SMS_PROVIDER, PAYMENT_GATEWAY, STORAGE_PROVIDER, RATE_LIMIT_STORE, GEOCODING_PROVIDER, EMAIL_PROVIDER, PUSH_PROVIDER]
})
export class IntegrationsModule {}
