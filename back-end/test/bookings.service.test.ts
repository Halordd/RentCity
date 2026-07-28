import assert from "node:assert/strict";
import test from "node:test";
import { UserRole } from "@prisma/client";
import type { AuthenticatedUser } from "../src/common/auth/auth.types";
import type { PrismaService } from "../src/database/prisma.service";
import type { NotificationsService } from "../src/modules/notifications/notifications.service";
import { BookingsService } from "../src/modules/bookings/bookings.service";

test("bookings service lists authenticated user's bookings", async () => {
  const user = { id: "tenant_1", phone: "+84912345678", role: UserRole.TENANT } satisfies AuthenticatedUser;
  let findManyPayload: unknown;
  const prisma = {
    booking: {
      findMany: async (payload: unknown) => {
        findManyPayload = payload;
        return [{ id: "booking_1", tenantId: user.id, listingId: "listing_1" }];
      }
    }
  } as unknown as PrismaService;
  const service = new BookingsService(prisma, {} as NotificationsService);

  const result = await service.myBookings(user);

  assert.equal(result.items[0]?.id, "booking_1");
  assert.deepEqual((findManyPayload as { where: unknown }).where, { tenantId: user.id });
});
