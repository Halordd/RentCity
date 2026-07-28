import { PrismaClient, ListingStatus, UserRole, VerificationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.user.upsert({
    where: { phone: "+84912345678" },
    update: {},
    create: {
      phone: "+84912345678",
      fullName: "Nguyen Minh Anh",
      email: "tenant@rentcity.test",
      role: UserRole.TENANT,
      preferredArea: "Quan 7"
    }
  });

  const owner = await prisma.user.upsert({
    where: { phone: "+84987654321" },
    update: {},
    create: {
      phone: "+84987654321",
      fullName: "Anh Minh Nguyen",
      email: "owner@rentcity.test",
      role: UserRole.OWNER,
      status: "PENDING_VERIFICATION"
    }
  });

  await prisma.user.upsert({
    where: { phone: "+84900000000" },
    update: {},
    create: {
      phone: "+84900000000",
      fullName: "RentCity Admin",
      email: "admin@rentcity.test",
      role: UserRole.ADMIN
    }
  });

  const studio = await prisma.listing.upsert({
    where: { id: "studio-nguyen-van-cu" },
    update: {},
    create: {
      id: "studio-nguyen-van-cu",
      ownerId: owner.id,
      title: "Studio Nguyen Van Cu",
      description: "Studio moi, noi that sang mau, co cua so lon va ban cong nho.",
      address: "Nguyen Van Cu, Quan 7",
      district: "Quan 7",
      price: 5800000,
      deposit: 5800000,
      area: 28,
      bedrooms: 1,
      bathrooms: 1,
      floor: "Tang 5",
      electricityFee: "4k/kWh",
      waterFee: "100k/thang",
      parkingFee: "150k/thang",
      petAllowed: false,
      amenities: ["Air conditioner", "Private washer", "Balcony"],
      lat: 10.729,
      lng: 106.721,
      status: ListingStatus.PUBLISHED,
      availableFrom: new Date()
    }
  });

  const apartment = await prisma.listing.upsert({
    where: { id: "can-ho-thao-dien" },
    update: {},
    create: {
      id: "can-ho-thao-dien",
      ownerId: owner.id,
      title: "Can ho Thao Dien",
      description: "Can ho rong, gan tien ich, phu hop gia dinh tre.",
      address: "Thao Dien, Thu Duc",
      district: "Thu Duc",
      price: 15000000,
      deposit: 15000000,
      area: 76,
      bedrooms: 2,
      bathrooms: 2,
      petAllowed: true,
      amenities: ["Elevator", "Pet friendly", "Security camera"],
      lat: 10.802,
      lng: 106.733,
      status: ListingStatus.PUBLISHED,
      availableFrom: new Date()
    }
  });

  await prisma.listingImage.deleteMany({
    where: { listingId: { in: [studio.id, apartment.id] } }
  });

  await prisma.listingImage.createMany({
    data: [
      {
        listingId: studio.id,
        url: "/uploads/listings/studio-nguyen-van-cu.jpg",
        alt: "Studio Nguyen Van Cu",
        sortOrder: 0
      },
      {
        listingId: apartment.id,
        url: "/uploads/listings/can-ho-thao-dien.jpg",
        alt: "Can ho Thao Dien",
        sortOrder: 0
      }
    ]
  });

  await prisma.savedListing.upsert({
    where: { userId_listingId: { userId: tenant.id, listingId: studio.id } },
    update: {},
    create: { userId: tenant.id, listingId: studio.id }
  });

  await prisma.verification.upsert({
    where: { id: "verification-owner-demo" },
    update: {},
    create: {
      id: "verification-owner-demo",
      ownerId: owner.id,
      status: VerificationStatus.PENDING,
      note: "Owner submitted identity and ownership documents."
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
