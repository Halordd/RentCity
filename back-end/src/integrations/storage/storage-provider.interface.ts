export type CreateUploadIntentInput = {
  ownerId: string;
  listingId: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
};

export type CreatePrivateFileUploadInput = {
  ownerId: string;
  category: string;
  targetType?: string;
  targetId?: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
};

export type UploadIntent = {
  provider: string;
  objectKey: string;
  publicUrl?: string;
  uploadUrl: string;
  method: "PUT" | "POST";
  headers?: Record<string, string>;
  expiresAt: string;
};

export type ReadIntent = {
  provider: string;
  objectKey: string;
  readUrl: string;
  expiresAt: string;
};

export interface StorageProvider {
  createListingImageUpload(input: CreateUploadIntentInput): Promise<UploadIntent>;
  createPrivateFileUpload(input: CreatePrivateFileUploadInput): Promise<UploadIntent>;
  createPrivateFileRead(objectKey: string): Promise<ReadIntent>;
}

export const STORAGE_PROVIDER = Symbol("STORAGE_PROVIDER");
