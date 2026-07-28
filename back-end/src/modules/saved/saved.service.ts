import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class SavedService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const items = await this.prisma.savedListing.findMany({
      where: { userId },
      include: {
        listing: {
          include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return {
      items: items.map((item) => ({
        id: item.id,
        listingId: item.listingId,
        createdAt: item.createdAt,
        listing: {
          id: item.listing.id,
          title: item.listing.title,
          district: item.listing.district,
          address: item.listing.address,
          price: item.listing.price,
          area: item.listing.area,
          imageUrl: item.listing.images[0]?.url ?? null
        }
      }))
    };
  }

  async save(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException("Listing not found");

    await this.prisma.savedListing.upsert({
      where: { userId_listingId: { userId, listingId } },
      update: {},
      create: { userId, listingId }
    });

    return { listingId, saved: true };
  }

  async remove(userId: string, listingId: string) {
    await this.prisma.savedListing.deleteMany({
      where: { userId, listingId }
    });

    return { listingId, saved: false };
  }
}
