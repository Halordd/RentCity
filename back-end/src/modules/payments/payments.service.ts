import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PaymentStatus, UserRole } from "@prisma/client";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { CreateDepositDto } from "./dto/create-deposit.dto";

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDeposit(user: AuthenticatedUser, payload: CreateDepositDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: payload.listingId } });
    if (!listing) throw new NotFoundException("Listing not found");

    return this.prisma.payment.create({
      data: {
        userId: user.id,
        listingId: payload.listingId,
        amount: payload.amount,
        provider: payload.provider,
        status: PaymentStatus.PENDING
      }
    });
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

  async webhook(payload: Record<string, unknown>) {
    const reference = typeof payload.reference === "string" ? payload.reference : undefined;
    const status = typeof payload.status === "string" ? payload.status : undefined;

    if (reference && status) {
      await this.prisma.payment.updateMany({
        where: { reference },
        data: { status: this.mapProviderStatus(status) }
      });
    }

    return { received: true, payload };
  }

  private mapProviderStatus(status: string): PaymentStatus {
    const normalized = status.toLowerCase();
    if (["paid", "success", "succeeded"].includes(normalized)) return PaymentStatus.PAID;
    if (["failed", "cancelled", "canceled"].includes(normalized)) return PaymentStatus.FAILED;
    return PaymentStatus.PROCESSING;
  }
}
