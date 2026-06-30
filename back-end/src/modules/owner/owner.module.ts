import { Module } from "@nestjs/common";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { OwnerController } from "./owner.controller";
import { OwnerService } from "./owner.service";

@Module({
  imports: [IntegrationsModule, NotificationsModule],
  controllers: [OwnerController],
  providers: [OwnerService]
})
export class OwnerModule {}
