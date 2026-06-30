import { Injectable } from "@nestjs/common";
import { NotificationChannel, Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { CreatePushSubscriptionDto } from "./dto/create-push-subscription.dto";

export type EnqueueNotificationInput = {
  userId?: string;
  channel?: NotificationChannel;
  topic: string;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
  scheduledAt?: Date;
};

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

  async listUserNotifications(userId: string) {
    const items = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    return { items };
  }

  async markRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() }
    });

    return this.prisma.notification.findFirst({
      where: { id, userId }
    });
  }

  async enqueue(input: EnqueueNotificationInput) {
    return this.prisma.notification.create({
      data: {
        userId: input.userId,
        channel: input.channel ?? NotificationChannel.IN_APP,
        topic: input.topic,
        title: input.title,
        body: input.body,
        payload: input.payload as Prisma.InputJsonObject,
        scheduledAt: input.scheduledAt
      }
    });
  }
}
