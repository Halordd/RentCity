import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateUploadIntentInput, StorageProvider, UploadIntent } from "./storage-provider.interface";
import { assertListingImageUpload, createListingImageObjectKey } from "./storage-utils";

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly config: ConfigService) {}

  async createListingImageUpload(input: CreateUploadIntentInput): Promise<UploadIntent> {
    assertListingImageUpload(input);

    const provider = this.config.get<string>("STORAGE_PROVIDER", "local");
    const baseUrl = this.config.get<string>("UPLOAD_PUBLIC_BASE_URL", "http://localhost:4000/uploads");
    const objectKey = createListingImageObjectKey(input);
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
}
