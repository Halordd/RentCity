import { Module } from "@nestjs/common";
import { LocalPaymentGateway } from "./payments/local-payment.gateway";
import { PAYMENT_GATEWAY } from "./payments/payment-gateway.interface";
import { LocalSmsProvider } from "./sms/local-sms.provider";
import { SMS_PROVIDER } from "./sms/sms-provider.interface";
import { LocalStorageProvider } from "./storage/local-storage.provider";
import { STORAGE_PROVIDER } from "./storage/storage-provider.interface";

@Module({
  providers: [
    LocalSmsProvider,
    LocalPaymentGateway,
    LocalStorageProvider,
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
      useExisting: LocalStorageProvider
    }
  ],
  exports: [SMS_PROVIDER, PAYMENT_GATEWAY, STORAGE_PROVIDER]
})
export class IntegrationsModule {}
