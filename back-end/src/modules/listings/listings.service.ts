import { Injectable, NotFoundException } from "@nestjs/common";
import { ListingStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { SearchListingsDto } from "./dto/search-listings.dto";

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchListingsDto) {
    const where: Prisma.ListingWhereInput = {
      status: ListingStatus.PUBLISHED,
      ...(query.district ? { district: { contains: query.district, mode: "insensitive" } } : {}),
      ...(query.keyword
        ? {
            OR: [
              { title: { contains: query.keyword, mode: "insensitive" } },
              { description: { contains: query.keyword, mode: "insensitive" } },
              { address: { contains: query.keyword, mode: "insensitive" } }
            ]
          }
        : {}),
      ...(query.minPrice || query.maxPrice ? { price: { gte: query.minPrice, lte: query.maxPrice } } : {}),
      ...(query.minArea ? { area: { gte: query.minArea } } : {}),
      ...(query.petAllowed !== undefined ? { petAllowed: query.petAllowed } : {})
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.listing.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          owner: { select: { id: true, fullName: true, phone: true, status: true } }
        },
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit
      }),
      this.prisma.listing.count({ where })
    ]);

    return {
      items: items.map((item) => this.toListingCard(item)),
      page: query.page,
      limit: query.limit,
      total
    };
  }

  async detail(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        owner: { select: { id: true, fullName: true, phone: true, status: true } }
      }
    });

    if (!listing) throw new NotFoundException("Listing not found");
    return this.toListingDetail(listing);
  }

  private toListingCard(listing: Prisma.ListingGetPayload<{ include: { images: true; owner: { select: { id: true; fullName: true; phone: true; status: true } } } }>) {
    return {
      id: listing.id,
      title: listing.title,
      district: listing.district,
      address: listing.address,
      price: listing.price,
      area: listing.area,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      status: listing.status,
      imageUrl: listing.images[0]?.url ?? null,
      amenities: listing.amenities,
      owner: listing.owner,
      availableFrom: listing.availableFrom,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt
    };
  }

  private toListingDetail(listing: Prisma.ListingGetPayload<{ include: { images: true; owner: { select: { id: true; fullName: true; phone: true; status: true } } } }>) {
    return {
      ...this.toListingCard(listing),
      description: listing.description,
      deposit: listing.deposit,
      city: listing.city,
      floor: listing.floor,
      electricityFee: listing.electricityFee,
      waterFee: listing.waterFee,
      parkingFee: listing.parkingFee,
      petAllowed: listing.petAllowed,
      images: listing.images,
      coordinates: {
        lat: listing.lat ? Number(listing.lat) : null,
        lng: listing.lng ? Number(listing.lng) : null
      }
    };
  }
}
