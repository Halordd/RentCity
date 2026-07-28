import { BadRequestException } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import type { CreatePrivateFileUploadInput, CreateUploadIntentInput } from "./storage-provider.interface";

const allowedImageContentTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const allowedPrivateFileContentTypes = new Set([...allowedImageContentTypes, "application/pdf"]);

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

export function assertPrivateFileUpload(input: CreatePrivateFileUploadInput): void {
  if (!allowedPrivateFileContentTypes.has(input.contentType)) {
    throw new BadRequestException("Private files must be jpeg, png, webp, avif, or pdf.");
  }
}

export function createPrivateFileObjectKey(input: CreatePrivateFileUploadInput): string {
  const safeFilename = input.filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "document";
  const digest = createHash("sha256")
    .update(`${input.ownerId}:${input.category}:${input.targetType ?? ""}:${input.targetId ?? ""}:${input.filename}:${input.sizeBytes}`)
    .digest("hex")
    .slice(0, 12);

  return `private/${input.ownerId}/${input.category.toLowerCase()}/${digest}-${randomUUID().slice(0, 8)}-${safeFilename}`;
}
