import assert from "node:assert/strict";
import test from "node:test";
import { UnauthorizedException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { PaymentStatus } from "@prisma/client";
import { createHmac } from "node:crypto";
import type { PrismaService } from "../src/database/prisma.service";
import type { PaymentWebhookDto } from "../src/modules/payments/dto/payment-webhook.dto";
import { PaymentsService } from "../src/modules/payments/payments.service";

function createService(secret?: string) {
  let updatePayload: unknown;
  const prisma = {
    payment: {
      updateMany: async (payload: unknown) => {
        updatePayload = payload;
        return { count: 1 };
      }
    }
  } as unknown as PrismaService;
  const config = {
    get: <T>(key: string) => (key === "PAYMENT_WEBHOOK_SECRET" ? secret : undefined) as T
  } as ConfigService;

  return {
    service: new PaymentsService(prisma, config),
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
