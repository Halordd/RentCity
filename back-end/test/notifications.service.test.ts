import assert from "node:assert/strict";
import test from "node:test";
import { NotificationChannel } from "@prisma/client";
import type { PrismaService } from "../src/database/prisma.service";
import { NotificationsService } from "../src/modules/notifications/notifications.service";

test("notifications service enqueues in-app notifications", async () => {
  let createPayload: unknown;
  const prisma = {
    notification: {
      create: async (payload: unknown) => {
        createPayload = payload;
        return { id: "notification_1", ...((payload as { data: Record<string, unknown> }).data ?? {}) };
      }
    }
  } as unknown as PrismaService;
  const service = new NotificationsService(prisma);

  const result = await service.enqueue({
    userId: "user_1",
    topic: "booking.created",
    title: "Co lich xem nha moi",
    body: "Khach thue vua dat lich xem nha.",
    payload: { bookingId: "booking_1" }
  });

  assert.equal(result.id, "notification_1");
  assert.deepEqual(createPayload, {
    data: {
      userId: "user_1",
      channel: NotificationChannel.IN_APP,
      topic: "booking.created",
      title: "Co lich xem nha moi",
      body: "Khach thue vua dat lich xem nha.",
      payload: { bookingId: "booking_1" },
      scheduledAt: undefined
    }
  });
});

test("notifications service lists and marks user notifications as read", async () => {
  let updatePayload: unknown;
  const prisma = {
    notification: {
      findMany: async () => [{ id: "notification_1", userId: "user_1" }],
      updateMany: async (payload: unknown) => {
        updatePayload = payload;
        return { count: 1 };
      },
      findFirst: async () => ({ id: "notification_1", userId: "user_1", readAt: new Date("2026-07-01T00:00:00.000Z") })
    }
  } as unknown as PrismaService;
  const service = new NotificationsService(prisma);

  const list = await service.listUserNotifications("user_1");
  const read = await service.markRead("user_1", "notification_1");

  assert.deepEqual(list.items, [{ id: "notification_1", userId: "user_1" }]);
  assert.equal(read?.id, "notification_1");
  assert.deepEqual((updatePayload as { where: unknown }).where, {
    id: "notification_1",
    userId: "user_1"
  });
});
