import { Module } from "@nestjs/common";
import { LocalSmsProvider } from "./sms/local-sms.provider";
import { SMS_PROVIDER } from "./sms/sms-provider.interface";

@Module({
  providers: [
    LocalSmsProvider,
    {
      provide: SMS_PROVIDER,
      useExisting: LocalSmsProvider
    }
  ],
  exports: [SMS_PROVIDER]
})
export class IntegrationsModule {}
