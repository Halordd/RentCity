import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BookingStatus, ListingStatus, UserRole } from "@prisma/client";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { STORAGE_PROVIDER, StorageProvider } from "../../integrations/storage/storage-provider.interface";
import { NotificationsService } from "../notifications/notifications.service";
import { AddListingImageDto } from "./dto/add-listing-image.dto";
import { CreateImageUploadIntentDto } from "./dto/create-image-upload-intent.dto";
import { CreateOwnerListingDto } from "./dto/create-owner-listing.dto";
import { UpdateOwnerListingDto } from "./dto/update-owner-listing.dto";

@Injectable()
export class OwnerService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_PROVIDER) private readonly storageProvider: StorageProvider,
    private readonly notifications: NotificationsService
  ) {}

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

  async createImageUploadIntent(user: AuthenticatedUser, id: string, payload: CreateImageUploadIntentDto) {
    await this.assertListingAccess(user, id);

    const upload = await this.storageProvider.createListingImageUpload({
      ownerId: user.id,
      listingId: id,
      filename: payload.filename,
      contentType: payload.contentType,
      sizeBytes: payload.sizeBytes
    });

    return {
      upload,
      image: {
        listingId: id,
        url: upload.publicUrl,
        alt: payload.alt,
        sortOrder: payload.sortOrder ?? 0
      }
    };
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

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CONFIRMED },
      include: { listing: { select: { id: true, title: true } } }
    });

    await this.notifications.enqueue({
      userId: booking.tenantId,
      topic: "booking.confirmed",
      title: "Lich xem nha da duoc xac nhan",
      body: `Chu nha da xac nhan lich xem ${updated.listing.title}.`,
      payload: {
        bookingId: updated.id,
        listingId: updated.listing.id,
        status: updated.status
      }
    });

    return updated;
  }

  private async assertListingAccess(user: AuthenticatedUser, id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException("Listing not found");
    if (user.role !== UserRole.ADMIN && listing.ownerId !== user.id) {
      throw new ForbiddenException("Cannot modify another owner's listing");
    }
  }
}
