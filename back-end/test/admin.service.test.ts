import assert from "node:assert/strict";
import test from "node:test";
import { ListingStatus } from "@prisma/client";
import type { PrismaService } from "../src/database/prisma.service";
import { AdminService } from "../src/modules/admin/admin.service";

test("admin service lists listing review queue", async () => {
  let findManyPayload: unknown;
  const prisma = {
    listing: {
      findMany: async (payload: unknown) => {
        findManyPayload = payload;
        return [{ id: "listing_1", status: ListingStatus.PENDING_REVIEW }];
      }
    }
  } as unknown as PrismaService;
  const service = new AdminService(prisma);

  const result = await service.listings();

  assert.equal(result.items[0]?.id, "listing_1");
  assert.deepEqual((findManyPayload as { where: unknown }).where, {
    status: { in: [ListingStatus.PENDING_REVIEW, ListingStatus.REJECTED] }
  });
});
