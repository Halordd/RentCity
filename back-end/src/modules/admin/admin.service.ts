import { Injectable, NotFoundException } from "@nestjs/common";
import { ListingStatus, VerificationStatus } from "@prisma/client";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { ReviewListingDto } from "./dto/review-listing.dto";
import { UpdateDisputeDto } from "./dto/update-dispute.dto";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async metrics() {
    const [listingsPendingReview, verificationsPending, disputesOpen, paymentIssues] = await this.prisma.$transaction([
      this.prisma.listing.count({ where: { status: ListingStatus.PENDING_REVIEW } }),
      this.prisma.verification.count({ where: { status: VerificationStatus.PENDING } }),
      this.prisma.dispute.count({ where: { status: { in: ["OPEN", "IN_REVIEW"] } } }),
      this.prisma.payment.count({ where: { status: "FAILED" } })
    ]);

    return {
      listingsPendingReview,
      verificationsPending,
      disputesOpen,
      paymentIssues
    };
  }

  async verifications() {
    const items = await this.prisma.verification.findMany({
      include: { owner: { select: { id: true, fullName: true, phone: true, status: true } } },
      orderBy: { createdAt: "desc" }
    });

    return {
      items
    };
  }

  async listings() {
    const items = await this.prisma.listing.findMany({
      where: { status: { in: [ListingStatus.PENDING_REVIEW, ListingStatus.REJECTED] } },
      include: {
        owner: { select: { id: true, fullName: true, phone: true, status: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1 }
      },
      orderBy: { updatedAt: "desc" },
      take: 100
    });

    return { items };
  }

  async setVerificationStatus(user: AuthenticatedUser, id: string, status: VerificationStatus) {
    const verification = await this.prisma.verification.update({
      where: { id },
      data: { status }
    }).catch(() => null);

    if (!verification) throw new NotFoundException("Verification not found");
    await this.audit(user.id, "verification.update", id, { status });
    return verification;
  }

  async reviewListing(user: AuthenticatedUser, id: string, payload: ReviewListingDto) {
    const listing = await this.prisma.listing.update({
      where: { id },
      data: { status: payload.status }
    }).catch(() => null);

    if (!listing) throw new NotFoundException("Listing not found");
    await this.audit(user.id, "listing.review", id, payload);
    return listing;
  }

  async disputes() {
    const items = await this.prisma.dispute.findMany({
      include: { user: { select: { id: true, fullName: true, phone: true } } },
      orderBy: { createdAt: "desc" }
    });
    return { items };
  }

  async updateDispute(user: AuthenticatedUser, id: string, payload: UpdateDisputeDto) {
    const dispute = await this.prisma.dispute.update({
      where: { id },
      data: { status: payload.status }
    }).catch(() => null);

    if (!dispute) throw new NotFoundException("Dispute not found");
    await this.audit(user.id, "dispute.update", id, payload);
    return dispute;
  }

  async auditLogs() {
    const items = await this.prisma.auditLog.findMany({
      include: { actor: { select: { id: true, fullName: true, phone: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    return { items };
  }

  private async audit(actorId: string, action: string, target: string, metadata: object) {
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action,
        target,
        metadata
      }
    });
  }
}
