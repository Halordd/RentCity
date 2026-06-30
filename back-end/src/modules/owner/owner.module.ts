import { Module } from "@nestjs/common";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { OwnerController } from "./owner.controller";
import { OwnerService } from "./owner.service";

@Module({
  imports: [IntegrationsModule],
  controllers: [OwnerController],
  providers: [OwnerService]
})
export class OwnerModule {}
