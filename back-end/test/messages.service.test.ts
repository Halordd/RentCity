import assert from "node:assert/strict";
import test from "node:test";
import { UserRole } from "@prisma/client";
import type { AuthenticatedUser } from "../src/common/auth/auth.types";
import type { PrismaService } from "../src/database/prisma.service";
import type { NotificationsService } from "../src/modules/notifications/notifications.service";
import { MessagesService } from "../src/modules/messages/messages.service";

const tenant = { id: "tenant_1", phone: "+84912345678", role: UserRole.TENANT } satisfies AuthenticatedUser;
const owner = { id: "owner_1", phone: "+84987654321", role: UserRole.OWNER } satisfies AuthenticatedUser;

test("messages service returns latest message and unread counts", async () => {
  const prisma = {
    conversation: {
      findMany: async () => [
        {
          id: "conversation_1",
          listingId: "listing_1",
          tenantId: tenant.id,
          ownerId: owner.id,
          listing: { id: "listing_1", title: "Studio Nguyen Van Cu" },
          tenant: { id: tenant.id, fullName: "Tenant", phone: tenant.phone },
          owner: { id: owner.id, fullName: "Owner", phone: owner.phone },
          messages: [{ id: "message_2", body: "Con phong khong?", senderId: owner.id }]
        }
      ]
    },
    message: {
      groupBy: async () => [{ conversationId: "conversation_1", _count: { _all: 2 } }]
    }
  } as unknown as PrismaService;
  const service = new MessagesService(prisma, {} as NotificationsService);

  const result = await service.conversations(tenant);

  assert.equal(result.items[0]?.lastMessage?.id, "message_2");
  assert.equal(result.items[0]?.unreadCount, 2);
  assert.equal("messages" in (result.items[0] ?? {}), false);
});

test("messages service marks incoming conversation messages as read", async () => {
  let updatePayload: unknown;
  const prisma = {
    conversation: {
      findUnique: async () => ({
        id: "conversation_1",
        tenantId: tenant.id,
        ownerId: owner.id,
        listingId: "listing_1"
      })
    },
    message: {
      updateMany: async (payload: unknown) => {
        updatePayload = payload;
        return { count: 3 };
      }
    }
  } as unknown as PrismaService;
  const service = new MessagesService(prisma, {} as NotificationsService);

  const result = await service.markRead(tenant, "conversation_1");

  assert.equal(result.readCount, 3);
  assert.deepEqual((updatePayload as { where: unknown }).where, {
    conversationId: "conversation_1",
    senderId: { not: tenant.id },
    readAt: null
  });
});

test("messages service enqueues a notification for the message recipient", async () => {
  let notificationPayload: unknown;
  const prisma = {
    conversation: {
      findUnique: async () => ({
        id: "conversation_1",
        tenantId: tenant.id,
        ownerId: owner.id,
        listingId: "listing_1"
      }),
      update: async () => ({ id: "conversation_1" })
    },
    message: {
      create: async (payload: unknown) => ({
        id: "message_1",
        body: (payload as { data: { body: string } }).data.body,
        sender: { id: tenant.id, fullName: "Tenant", phone: tenant.phone, role: tenant.role }
      })
    }
  } as unknown as PrismaService;
  const notifications = {
    enqueue: async (payload: unknown) => {
      notificationPayload = payload;
      return { id: "notification_1" };
    }
  } as unknown as NotificationsService;
  const service = new MessagesService(prisma, notifications);

  const result = await service.create(tenant, "conversation_1", "Minh muon xem nha vao thu Bay.");

  assert.equal(result.id, "message_1");
  assert.deepEqual(notificationPayload, {
    userId: owner.id,
    topic: "message.created",
    title: "Co tin nhan moi",
    body: "Minh muon xem nha vao thu Bay.",
    payload: {
      conversationId: "conversation_1",
      messageId: "message_1",
      senderId: tenant.id,
      listingId: "listing_1"
    }
  });
});
