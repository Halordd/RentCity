import { assets } from "../data";
import { resolveApiAssetUrl } from "../api/httpClient";
import type { Booking, Listing, Message } from "../types";

export interface ApiUserSummary {
  id: string;
  fullName?: string | null;
  phone?: string | null;
  role?: string;
}

export interface ApiListing {
  id: string;
  title: string;
  district: string;
  address: string;
  price: number;
  area: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floor?: string | null;
  deposit?: number | null;
  electricityFee?: string | null;
  waterFee?: string | null;
  parkingFee?: string | null;
  petAllowed?: boolean;
  amenities?: string[];
  imageUrl?: string | null;
  images?: Array<{ url: string; alt?: string | null }>;
  owner?: ApiUserSummary | null;
  availableFrom?: string | null;
  coordinates?: { lat?: number | null; lng?: number | null };
}

export interface ApiBooking {
  id: string;
  listingId: string;
  date: string;
  timeSlot: string;
  status: string;
}

export interface ApiMessage {
  id: string;
  body: string;
  senderId?: string;
  sender?: ApiUserSummary;
}

const fallbackImages = [assets.bedroom, assets.apartment, assets.livingroom, assets.house, assets.building];

function compactMoney(value?: number | null): string {
  if (!value) return "1 thang";
  const millionValue = value >= 100000 ? value / 1000000 : value;
  return `${Number(millionValue.toFixed(1)).toLocaleString("vi-VN")}tr`;
}

function priceToMillion(value: number): number {
  return value >= 100000 ? Number((value / 1000000).toFixed(1)) : value;
}

function dateLabel(value?: string | null): string {
  if (!value) return "Co lich trong";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

export function mapApiListing(input: ApiListing, fallbackIndex = 0): Listing {
  const image = resolveApiAssetUrl(input.images?.[0]?.url || input.imageUrl) || fallbackImages[fallbackIndex % fallbackImages.length];
  const owner = input.owner?.fullName || input.owner?.phone || "RentCity Owner";
  const tags = [...(input.amenities || [])];
  if (input.petAllowed && !tags.some((tag) => tag.toLowerCase().includes("pet"))) tags.push("Pet friendly");

  return {
    id: input.id,
    title: input.title,
    district: input.district,
    address: input.address,
    price: priceToMillion(input.price),
    area: input.area,
    rooms: input.bedrooms || 1,
    wc: input.bathrooms || 1,
    floor: input.floor || "Dang cap nhat",
    deposit: input.deposit ? `Coc ${compactMoney(input.deposit)}` : "Coc 1 thang",
    electricity: input.electricityFee || "Theo nha nuoc",
    water: input.waterFee || "Theo nha nuoc",
    parking: input.parkingFee || "Dang cap nhat",
    tags: tags.length ? tags : ["Anh that", "Da xac minh"],
    image,
    owner,
    verified: true,
    available: dateLabel(input.availableFrom),
    score: 86,
    coordinates: input.coordinates?.lat && input.coordinates?.lng ? `${input.coordinates.lat}, ${input.coordinates.lng}` : "Dang cap nhat",
    ownerId: input.owner?.id
  };
}

export function mapApiBooking(input: ApiBooking): Booking {
  return {
    id: input.id,
    listingId: input.listingId,
    date: dateLabel(input.date),
    time: input.timeSlot,
    status: input.status
  };
}

export function mapApiMessage(input: ApiMessage, currentUserId?: string): Message {
  return {
    from: input.senderId === currentUserId || input.sender?.id === currentUserId ? "Bạn" : input.sender?.fullName || "Chủ nhà",
    body: input.body
  };
}

export function nextApiBookingDate(value?: FormDataEntryValue | null): string {
  const raw = String(value || "");
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);

  const next = new Date();
  next.setDate(next.getDate() + 2);
  return next.toISOString().slice(0, 10);
}
