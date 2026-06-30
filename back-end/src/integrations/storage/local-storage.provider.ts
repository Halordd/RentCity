import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash, randomUUID } from "node:crypto";
import { CreateUploadIntentInput, StorageProvider, UploadIntent } from "./storage-provider.interface";

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly config: ConfigService) {}

  async createListingImageUpload(input: CreateUploadIntentInput): Promise<UploadIntent> {
    const provider = this.config.get<string>("STORAGE_PROVIDER", "local");
    const baseUrl = this.config.get<string>("UPLOAD_PUBLIC_BASE_URL", "http://localhost:4000/uploads");
    const objectKey = this.createObjectKey(input);
    const publicUrl = `${baseUrl.replace(/\/$/, "")}/${objectKey}`;

    return {
      provider,
      objectKey,
      publicUrl,
      uploadUrl: publicUrl,
      method: "PUT",
      headers: {
        "content-type": input.contentType
      },
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    };
  }

  private createObjectKey(input: CreateUploadIntentInput): string {
    const safeFilename = input.filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
    const digest = createHash("sha256").update(`${input.ownerId}:${input.listingId}:${input.filename}:${input.sizeBytes}`).digest("hex").slice(0, 12);

    return `listings/${input.listingId}/${digest}-${randomUUID().slice(0, 8)}-${safeFilename}`;
  }
}
