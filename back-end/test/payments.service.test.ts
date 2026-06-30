import assert from "node:assert/strict";
import test from "node:test";
import { UnauthorizedException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { PaymentStatus } from "@prisma/client";
import { createHmac } from "node:crypto";
import type { PrismaService } from "../src/database/prisma.service";
import type { PaymentGateway } from "../src/integrations/payments/payment-gateway.interface";
import type { AuthenticatedUser } from "../src/common/auth/auth.types";
import type { PaymentWebhookDto } from "../src/modules/payments/dto/payment-webhook.dto";
import { PaymentsService } from "../src/modules/payments/payments.service";

function createService(secret?: string) {
  let updatePayload: unknown;
  let createPayload: unknown;
  const prisma = {
    listing: {
      findUnique: async () => ({ id: "listing_1", title: "Studio Nguyen Van Cu", ownerId: "owner_1" })
    },
    payment: {
      create: async (payload: unknown) => {
        createPayload = payload;
        return { id: "payment_1", ...((payload as { data: Record<string, unknown> }).data ?? {}) };
      },
      updateMany: async (payload: unknown) => {
        updatePayload = payload;
        return { count: 1 };
      }
    }
  } as unknown as PrismaService;
  const config = {
    get: <T>(key: string) => (key === "PAYMENT_WEBHOOK_SECRET" ? secret : undefined) as T
  } as ConfigService;
  const gateway = {
    createDepositIntent: async (input) => ({
      provider: input.provider ?? "local",
      reference: input.reference,
      checkoutUrl: `http://localhost:4000/pay/${input.reference}`,
      expiresAt: "2026-07-01T00:15:00.000Z"
    })
  } satisfies PaymentGateway;

  return {
    service: new PaymentsService(prisma, config, gateway),
    getCreatePayload: () => createPayload,
    getUpdatePayload: () => updatePayload
  };
}

function sign(payload: PaymentWebhookDto, secret: string): string {
  const message = [payload.reference, payload.status, payload.amount ?? "", payload.eventId ?? ""].join(".");
  return `sha256=${createHmac("sha256", secret).update(message).digest("hex")}`;
}

test("payment webhook accepts valid signatures and updates by reference", async () => {
  const secret = "payment-secret";
  const payload: PaymentWebhookDto = {
    reference: "rc_123",
    status: PaymentStatus.PAID,
    amount: 500000,
    eventId: "evt_1",
    provider: "payos"
  };
  const { service, getUpdatePayload } = createService(secret);

  const result = await service.webhook(payload, sign(payload, secret));

  assert.equal(result.received, true);
  assert.equal(result.updated, 1);
  assert.deepEqual(getUpdatePayload(), {
    where: { reference: "rc_123" },
    data: { status: PaymentStatus.PAID, provider: "payos" }
  });
});

test("payment deposit creates a payment and checkout intent", async () => {
  const { service, getCreatePayload } = createService();
  const user = { id: "tenant_1", phone: "+84912345678", role: "TENANT" } satisfies AuthenticatedUser;

  const result = await service.createDeposit(user, {
    listingId: "listing_1",
    amount: 500000,
    provider: "payos"
  });

  assert.equal(result.payment.id, "payment_1");
  assert.equal(result.payment.provider, "payos");
  assert.equal(result.checkout.provider, "payos");
  assert.match(result.checkout.reference, /^rc_/);
  assert.deepEqual(getCreatePayload(), {
    data: {
      userId: "tenant_1",
      listingId: "listing_1",
      amount: 500000,
      provider: "payos",
      reference: result.checkout.reference,
      status: PaymentStatus.PENDING
    }
  });
});

test("payment webhook rejects invalid signatures", async () => {
  const { service } = createService("payment-secret");

  await assert.rejects(
    () =>
      service.webhook(
        {
          reference: "rc_123",
          status: PaymentStatus.PAID,
          amount: 500000
        },
        "sha256=bad"
      ),
    (error) => error instanceof UnauthorizedException
  );
});
