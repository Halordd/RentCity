import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { CreatePushSubscriptionDto } from "./dto/create-push-subscription.dto";
import { UpdateAppStateDto } from "./dto/update-app-state.dto";
import { NotificationsService } from "./notifications.service";

@UseGuards(JwtAuthGuard)
@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get("me/app-state")
  async appState(@CurrentUser() user: AuthenticatedUser) {
    return ok(await this.notificationsService.appState(user.id));
  }

  @Patch("me/app-state")
  async updateAppState(@CurrentUser() user: AuthenticatedUser, @Body() body: UpdateAppStateDto) {
    return ok(await this.notificationsService.updateAppState(user.id, body.payload));
  }

  @Post("notifications/push-subscriptions")
  async createPushSubscription(@CurrentUser() user: AuthenticatedUser, @Body() body: CreatePushSubscriptionDto) {
    return ok(await this.notificationsService.createPushSubscription(user.id, body));
  }

  @Get("me/notifications")
  async notifications(@CurrentUser() user: AuthenticatedUser) {
    return ok(await this.notificationsService.listUserNotifications(user.id));
  }

  @Patch("me/notifications/:id/read")
  async markRead(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return ok(await this.notificationsService.markRead(user.id, id));
  }
}
