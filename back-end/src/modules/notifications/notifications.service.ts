import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { CreatePushSubscriptionDto } from "./dto/create-push-subscription.dto";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async appState(userId: string) {
    const state = await this.prisma.appState.findUnique({ where: { userId } });
    return state?.payload ?? {};
  }

  async updateAppState(userId: string, payload: Record<string, unknown>) {
    return this.prisma.appState.upsert({
      where: { userId },
      update: { payload: payload as Prisma.InputJsonObject },
      create: { userId, payload: payload as Prisma.InputJsonObject }
    });
  }

  async createPushSubscription(userId: string, payload: CreatePushSubscriptionDto) {
    return this.prisma.pushSubscription.upsert({
      where: { endpoint: payload.endpoint },
      update: {
        userId,
        keys: payload.keys as Prisma.InputJsonObject
      },
      create: {
        userId,
        endpoint: payload.endpoint,
        keys: payload.keys as Prisma.InputJsonObject
      }
    });
  }
}
