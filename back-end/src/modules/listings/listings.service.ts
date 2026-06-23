import { Injectable, NotFoundException } from "@nestjs/common";

const sampleListings = [
  {
    id: "studio-nguyen-van-cu",
    title: "Studio Nguyen Van Cu",
    district: "Quan 7",
    address: "Nguyen Van Cu, Quan 7",
    price: 5800000,
    area: 28,
    status: "PUBLISHED",
    imageUrl: "/uploads/listings/studio-nguyen-van-cu.jpg",
    amenities: ["Air conditioner", "Private washer", "Balcony"]
  },
  {
    id: "can-ho-thao-dien",
    title: "Can ho Thao Dien",
    district: "Thu Duc",
    address: "Thao Dien, Thu Duc",
    price: 15000000,
    area: 76,
    status: "PUBLISHED",
    imageUrl: "/uploads/listings/can-ho-thao-dien.jpg",
    amenities: ["Pet friendly", "Elevator", "Security camera"]
  }
];

@Injectable()
export class ListingsService {
  search(query: Record<string, string>) {
    return {
      items: sampleListings,
      filters: query
    };
  }

  detail(id: string) {
    const listing = sampleListings.find((item) => item.id === id);
    if (!listing) throw new NotFoundException("Listing not found");

    return {
      ...listing,
      description: "Clean rental listing prepared for RentCity frontend integration.",
      deposit: listing.price,
      coordinates: {
        lat: 10.729,
        lng: 106.721
      }
    };
  }
}
