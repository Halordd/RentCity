import { BadRequestException } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import type { CreateUploadIntentInput } from "./storage-provider.interface";

const allowedImageContentTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export function assertListingImageUpload(input: CreateUploadIntentInput): void {
  if (!allowedImageContentTypes.has(input.contentType)) {
    throw new BadRequestException("Listing images must be jpeg, png, webp, or avif.");
  }
}

export function createListingImageObjectKey(input: CreateUploadIntentInput): string {
  const safeFilename = input.filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
  const digest = createHash("sha256").update(`${input.ownerId}:${input.listingId}:${input.filename}:${input.sizeBytes}`).digest("hex").slice(0, 12);

  return `listings/${input.listingId}/${digest}-${randomUUID().slice(0, 8)}-${safeFilename}`;
}
