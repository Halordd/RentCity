import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { NotificationsService } from "./notifications.service";

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get("me/app-state")
  appState() {
    return ok(this.notificationsService.appState());
  }

  @Patch("me/app-state")
  updateAppState(@Body() body: Record<string, unknown>) {
    return ok(this.notificationsService.updateAppState(body));
  }

  @Post("notifications/push-subscriptions")
  createPushSubscription(@Body() body: Record<string, unknown>) {
    return ok(this.notificationsService.createPushSubscription(body));
  }
}
