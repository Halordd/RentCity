import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { BookingStatus, ListingStatus, UserRole } from "@prisma/client";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { NotificationsService } from "../notifications/notifications.service";
import { RescheduleBookingDto } from "./dto/reschedule-booking.dto";

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService
  ) {}

  async availability(listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, availableFrom: true, status: true }
    });
    if (!listing || listing.status !== ListingStatus.PUBLISHED) {
      throw new NotFoundException("Listing not found");
    }

    const existing = await this.prisma.booking.findMany({
      where: {
        listingId,
        status: { in: [BookingStatus.PENDING_OWNER, BookingStatus.CONFIRMED, BookingStatus.RESCHEDULED] }
      },
      select: { date: true, timeSlot: true }
    });

    const taken = new Set(existing.map((item) => `${item.date.toISOString().slice(0, 10)}:${item.timeSlot}`));
    const baseDate = listing.availableFrom ?? new Date();
    const slots = Array.from({ length: 7 }, (_, day) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + day);
      return ["09:00 - 11:00", "14:30 - 16:00"].map((time) => ({
        date: date.toISOString().slice(0, 10),
        time,
        available: !taken.has(`${date.toISOString().slice(0, 10)}:${time}`)
      }));
    }).flat();

    return {
      listingId,
      slots
    };
  }

  async create(user: AuthenticatedUser, payload: CreateBookingDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: payload.listingId },
      select: { id: true, status: true, ownerId: true, title: true }
    });
    if (!listing || listing.status !== ListingStatus.PUBLISHED) {
      throw new NotFoundException("Listing not found");
    }

    const booking = await this.prisma.booking.create({
      data: {
        listingId: payload.listingId,
        tenantId: user.id,
        date: new Date(payload.date),
        timeSlot: payload.timeSlot,
        note: payload.note,
        status: BookingStatus.PENDING_OWNER
      },
      include: { listing: { select: { id: true, title: true, address: true } } }
    });

    await this.notifications.enqueue({
      userId: listing.ownerId,
      topic: "booking.created",
      title: "Co lich xem nha moi",
      body: `Khach thue vua dat lich xem ${listing.title}.`,
      payload: {
        bookingId: booking.id,
        listingId: listing.id,
        tenantId: user.id,
        date: payload.date,
        timeSlot: payload.timeSlot
      }
    });

    return booking;
  }

  async myBookings(user: AuthenticatedUser) {
    const items = await this.prisma.booking.findMany({
      where: user.role === UserRole.ADMIN ? {} : { tenantId: user.id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            address: true,
            district: true,
            price: true,
            owner: { select: { id: true, fullName: true, phone: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { items };
  }

  async reschedule(user: AuthenticatedUser, id: string, payload: RescheduleBookingDto) {
    await this.assertBookingAccess(user, id);
    return this.prisma.booking.update({
      where: { id },
      data: {
        date: new Date(payload.date),
        timeSlot: payload.timeSlot,
        status: BookingStatus.RESCHEDULED
      }
    });
  }

  async cancel(user: AuthenticatedUser, id: string) {
    await this.assertBookingAccess(user, id);
    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED }
    });
  }

  private async assertBookingAccess(user: AuthenticatedUser, id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { listing: true }
    });
    if (!booking) throw new NotFoundException("Booking not found");
    if (user.role === UserRole.ADMIN) return;
    if (booking.tenantId !== user.id && booking.listing.ownerId !== user.id) {
      throw new ForbiddenException("Cannot modify this booking");
    }
  }
}
