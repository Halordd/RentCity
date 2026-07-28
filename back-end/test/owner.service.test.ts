import assert from "node:assert/strict";
import test from "node:test";
import { BookingStatus, ListingStatus, UserRole } from "@prisma/client";
import type { AuthenticatedUser } from "../src/common/auth/auth.types";
import type { PrismaService } from "../src/database/prisma.service";
import type { NotificationsService } from "../src/modules/notifications/notifications.service";
import type { StorageProvider } from "../src/integrations/storage/storage-provider.interface";
import { OwnerService } from "../src/modules/owner/owner.service";

test("owner service returns dashboard metrics and pipeline scoped to owner", async () => {
  const user = { id: "owner_1", phone: "+84987654321", role: UserRole.OWNER } satisfies AuthenticatedUser;
  const transactionInputs: unknown[] = [];
  const prisma = {
    listing: {
      count: async (payload: unknown) => {
        transactionInputs.push(payload);
        const status = (payload as { where?: { status?: unknown } }).where?.status;
        if (status === ListingStatus.PUBLISHED) return 4;
        return 6;
      },
      findMany: async () => [{ id: "listing_1", status: ListingStatus.PENDING_REVIEW }]
    },
    booking: {
      count: async (payload: unknown) => {
        transactionInputs.push(payload);
        const status = (payload as { where?: { status?: unknown } }).where?.status;
        if (status === BookingStatus.PENDING_OWNER) return 3;
        return 5;
      },
      findMany: async () => [{ id: "booking_1", status: BookingStatus.PENDING_OWNER }]
    },
    conversation: {
      count: async () => 2
    },
    contract: {
      count: async () => 1
    },
    payment: {
      aggregate: async () => ({ _sum: { amount: 5800000 } })
    },
    $transaction: async (items: Array<Promise<unknown>>) => Promise.all(items)
  } as unknown as PrismaService;
  const service = new OwnerService(prisma, {} as StorageProvider, {} as NotificationsService);

  const result = await service.dashboard(user);

  assert.equal(result.metrics.managedListings, 6);
  assert.equal(result.metrics.publishedListings, 4);
  assert.equal(result.metrics.pendingBookings, 3);
  assert.equal(result.metrics.confirmedBookings, 5);
  assert.equal(result.metrics.monthlyRevenue, 5800000);
  assert.equal(result.pipeline.find((item) => item.key === "negotiating")?.count, 2);
  assert.deepEqual((transactionInputs[0] as { where: unknown }).where, { ownerId: user.id });
});
