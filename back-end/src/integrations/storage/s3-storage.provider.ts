import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { CreateUploadIntentInput, StorageProvider, UploadIntent } from "./storage-provider.interface";
import { assertListingImageUpload, createListingImageObjectKey } from "./storage-utils";

@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;
  private readonly expiresInSeconds: number;

  constructor(private readonly config: ConfigService) {
    const enabled = this.config.get<string>("STORAGE_PROVIDER") === "s3";
    this.bucket = enabled ? this.required("S3_BUCKET") : "";
    this.publicBaseUrl = (enabled ? this.required("S3_PUBLIC_BASE_URL") : "http://localhost:4000/uploads").replace(/\/$/, "");
    this.expiresInSeconds = this.config.get<number>("S3_UPLOAD_EXPIRES_SECONDS", 600);
    this.client = new S3Client({
      region: enabled ? this.required("S3_REGION") : "us-east-1",
      endpoint: enabled ? this.config.get<string>("S3_ENDPOINT") || undefined : undefined,
      forcePathStyle: this.config.get<boolean>("S3_FORCE_PATH_STYLE", false),
      credentials: {
        accessKeyId: enabled ? this.required("S3_ACCESS_KEY_ID") : "local",
        secretAccessKey: enabled ? this.required("S3_SECRET_ACCESS_KEY") : "local"
      }
    });
  }

  async createListingImageUpload(input: CreateUploadIntentInput): Promise<UploadIntent> {
    assertListingImageUpload(input);

    const objectKey = createListingImageObjectKey(input);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
      ContentType: input.contentType,
      ContentLength: input.sizeBytes
    });
    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: this.expiresInSeconds });

    return {
      provider: "s3",
      objectKey,
      publicUrl: `${this.publicBaseUrl}/${objectKey}`,
      uploadUrl,
      method: "PUT",
      headers: {
        "content-type": input.contentType
      },
      expiresAt: new Date(Date.now() + this.expiresInSeconds * 1000).toISOString()
    };
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} is required when STORAGE_PROVIDER=s3.`);

    return value;
  }
}
