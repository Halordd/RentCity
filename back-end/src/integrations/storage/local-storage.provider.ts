import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreatePrivateFileUploadInput, CreateUploadIntentInput, ReadIntent, StorageProvider, UploadIntent } from "./storage-provider.interface";
import { assertListingImageUpload, assertPrivateFileUpload, createListingImageObjectKey, createPrivateFileObjectKey } from "./storage-utils";

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

  async createPrivateFileUpload(input: CreatePrivateFileUploadInput): Promise<UploadIntent> {
    assertPrivateFileUpload(input);

    const baseUrl = this.config.get<string>("UPLOAD_PUBLIC_BASE_URL", "http://localhost:4000/uploads");
    const objectKey = createPrivateFileObjectKey(input);
    const uploadUrl = `${baseUrl.replace(/\/$/, "")}/${objectKey}`;

    return {
      provider: "local",
      objectKey,
      uploadUrl,
      method: "PUT",
      headers: {
        "content-type": input.contentType
      },
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    };
  }

  async createPrivateFileRead(objectKey: string): Promise<ReadIntent> {
    const baseUrl = this.config.get<string>("UPLOAD_PUBLIC_BASE_URL", "http://localhost:4000/uploads");

    return {
      provider: "local",
      objectKey,
      readUrl: `${baseUrl.replace(/\/$/, "")}/${objectKey}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  }
}
