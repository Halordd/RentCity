import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { BookingStatus, ListingStatus, UserRole } from "@prisma/client";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { AddListingImageDto } from "./dto/add-listing-image.dto";
import { CreateOwnerListingDto } from "./dto/create-owner-listing.dto";
import { UpdateOwnerListingDto } from "./dto/update-owner-listing.dto";

@Injectable()
export class OwnerService {
  constructor(private readonly prisma: PrismaService) {}

  async listings(user: AuthenticatedUser) {
    const where = user.role === UserRole.ADMIN ? {} : { ownerId: user.id };
    const items = await this.prisma.listing.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { updatedAt: "desc" }
    });

    return { items };
  }

  async createListing(user: AuthenticatedUser, payload: CreateOwnerListingDto) {
    return this.prisma.listing.create({
      data: {
        ...payload,
        city: payload.city ?? "Ho Chi Minh City",
        amenities: payload.amenities ?? [],
        petAllowed: payload.petAllowed ?? false,
        ownerId: user.id,
        status: ListingStatus.DRAFT
      }
    });
  }

  async updateListing(user: AuthenticatedUser, id: string, payload: UpdateOwnerListingDto) {
    await this.assertListingAccess(user, id);

    return this.prisma.listing.update({
      where: { id },
      data: {
        ...payload,
        amenities: payload.amenities
      }
    });
  }

  async addImage(user: AuthenticatedUser, id: string, payload: AddListingImageDto) {
    await this.assertListingAccess(user, id);

    return this.prisma.listingImage.create({
      data: {
        listingId: id,
        url: payload.url,
        alt: payload.alt,
        sortOrder: payload.sortOrder ?? 0
      }
    });
  }

  async bookings(user: AuthenticatedUser) {
    const items = await this.prisma.booking.findMany({
      where: user.role === UserRole.ADMIN ? {} : { listing: { ownerId: user.id } },
      include: {
        listing: { select: { id: true, title: true, address: true } },
        tenant: { select: { id: true, fullName: true, phone: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return { items };
  }

  async confirmBooking(user: AuthenticatedUser, id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { listing: true }
    });

    if (!booking) throw new NotFoundException("Booking not found");
    if (user.role !== UserRole.ADMIN && booking.listing.ownerId !== user.id) {
      throw new ForbiddenException("Cannot confirm booking for another owner's listing");
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CONFIRMED }
    });
  }

  private async assertListingAccess(user: AuthenticatedUser, id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException("Listing not found");
    if (user.role !== UserRole.ADMIN && listing.ownerId !== user.id) {
      throw new ForbiddenException("Cannot modify another owner's listing");
    }
  }
}
