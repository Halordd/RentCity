import { Module } from "@nestjs/common";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [IntegrationsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
