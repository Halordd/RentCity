import { ForbiddenException, Inject, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PaymentStatus, Prisma, UserRole } from "@prisma/client";
import { Buffer } from "node:buffer";
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { PAYMENT_GATEWAY, PaymentGateway } from "../../integrations/payments/payment-gateway.interface";
import { CreateDepositDto } from "./dto/create-deposit.dto";
import { PaymentWebhookDto } from "./dto/payment-webhook.dto";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    @Inject(PAYMENT_GATEWAY) private readonly paymentGateway: PaymentGateway
  ) {}

  async createDeposit(user: AuthenticatedUser, payload: CreateDepositDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: payload.listingId } });
    if (!listing) throw new NotFoundException("Listing not found");
    const reference = this.createPaymentReference();
    const intent = await this.paymentGateway.createDepositIntent({
      reference,
      amount: payload.amount,
      currency: "VND",
      provider: payload.provider,
      description: `RentCity deposit for ${listing.title}`
    });

    const payment = await this.prisma.payment.create({
      data: {
        userId: user.id,
        listingId: payload.listingId,
        amount: payload.amount,
        provider: intent.provider,
        reference: intent.reference,
        status: PaymentStatus.PENDING
      }
    });

    return {
      payment,
      checkout: intent
    };
  }

  async detail(user: AuthenticatedUser, id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { listing: { select: { id: true, title: true, ownerId: true } } }
    });
    if (!payment) throw new NotFoundException("Payment not found");
    if (user.role !== UserRole.ADMIN && payment.userId !== user.id && payment.listing?.ownerId !== user.id) {
      throw new ForbiddenException("Cannot access this payment");
    }
    return payment;
  }

  async webhook(payload: PaymentWebhookDto, signature?: string) {
    this.assertWebhookSignature(payload, signature);
    const provider = payload.provider ?? "unknown";
    const eventKey = this.webhookEventKey(payload, provider);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findUnique({
          where: { reference: payload.reference },
          select: { id: true }
        });

        await tx.paymentWebhookEvent.create({
          data: {
            paymentId: payment?.id,
            provider,
            eventKey,
            reference: payload.reference,
            status: payload.status,
            payload: this.webhookPayloadJson(payload),
            processedAt: new Date()
          }
        });

        const updated = await tx.payment.updateMany({
          where: { reference: payload.reference },
          data: {
            status: payload.status,
            provider
          }
        });

        return updated.count;
      });

      return {
        received: true,
        duplicate: false,
        eventKey,
        reference: payload.reference,
        status: payload.status,
        updated: result
      };
    } catch (error) {
      if (this.isUniqueConstraintViolation(error)) {
        return {
          received: true,
          duplicate: true,
          eventKey,
          reference: payload.reference,
          status: payload.status,
          updated: 0
        };
      }

      throw error;
    }
  }

  private createPaymentReference(): string {
    return `rc_${Date.now()}_${randomUUID().slice(0, 8)}`;
  }

  private assertWebhookSignature(payload: PaymentWebhookDto, signature?: string): void {
    const secret = this.config.get<string>("PAYMENT_WEBHOOK_SECRET");
    if (!secret) return;

    const expected = createHmac("sha256", secret).update(this.webhookSigningPayload(payload)).digest("hex");
    const received = signature?.replace(/^sha256=/, "");

    if (!received || !this.safeEqual(expected, received)) {
      throw new UnauthorizedException("Invalid payment webhook signature");
    }
  }

  private webhookSigningPayload(payload: PaymentWebhookDto): string {
    return [payload.reference, payload.status, payload.amount ?? "", payload.eventId ?? ""].join(".");
  }

  private webhookEventKey(payload: PaymentWebhookDto, provider: string): string {
    if (payload.eventId) return `${provider}:${payload.eventId}`;
    return createHash("sha256").update(this.webhookSigningPayload(payload)).digest("hex");
  }

  private webhookPayloadJson(payload: PaymentWebhookDto): Prisma.InputJsonObject {
    return {
      reference: payload.reference,
      status: payload.status,
      amount: payload.amount,
      provider: payload.provider,
      eventId: payload.eventId
    };
  }

  private isUniqueConstraintViolation(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
  }

  private safeEqual(expected: string, received: string): boolean {
    const expectedBuffer = Buffer.from(expected, "hex");
    const receivedBuffer = Buffer.from(received, "hex");

    if (expectedBuffer.length !== receivedBuffer.length) return false;
    return timingSafeEqual(expectedBuffer, receivedBuffer);
  }
}
