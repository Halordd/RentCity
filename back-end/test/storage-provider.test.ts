import assert from "node:assert/strict";
import test from "node:test";
import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalStorageProvider } from "../src/integrations/storage/local-storage.provider";
import { S3StorageProvider } from "../src/integrations/storage/s3-storage.provider";

const uploadInput = {
  ownerId: "owner_1",
  listingId: "listing_1",
  filename: "Bright Bedroom.JPG",
  contentType: "image/jpeg",
  sizeBytes: 512000
};

test("local storage provider creates a listing image upload intent", async () => {
  const provider = new LocalStorageProvider(
    new ConfigService({
      STORAGE_PROVIDER: "local",
      UPLOAD_PUBLIC_BASE_URL: "http://localhost:4000/uploads"
    })
  );

  const intent = await provider.createListingImageUpload(uploadInput);

  assert.equal(intent.provider, "local");
  assert.equal(intent.method, "PUT");
  assert.equal(intent.headers?.["content-type"], "image/jpeg");
  assert.match(intent.objectKey, /^listings\/listing_1\/[a-f0-9]{12}-[a-f0-9-]+-bright-bedroom\.jpg$/);
  assert.equal(intent.publicUrl, `http://localhost:4000/uploads/${intent.objectKey}`);
  assert.equal(intent.uploadUrl, intent.publicUrl);
});

test("storage provider rejects non-image upload intents", async () => {
  const provider = new LocalStorageProvider(new ConfigService({ STORAGE_PROVIDER: "local" }));

  await assert.rejects(
    () => provider.createListingImageUpload({ ...uploadInput, contentType: "application/pdf" }),
    BadRequestException
  );
});

test("S3 storage provider creates a presigned listing image upload intent", async () => {
  const provider = new S3StorageProvider(
    new ConfigService({
      STORAGE_PROVIDER: "s3",
      S3_BUCKET: "rentcity-uploads",
      S3_REGION: "ap-southeast-1",
      S3_ENDPOINT: "http://localhost:9000",
      S3_ACCESS_KEY_ID: "access-key",
      S3_SECRET_ACCESS_KEY: "secret-key",
      S3_PUBLIC_BASE_URL: "https://cdn.rentcity.test/uploads",
      S3_FORCE_PATH_STYLE: true,
      S3_UPLOAD_EXPIRES_SECONDS: 900
    })
  );

  const intent = await provider.createListingImageUpload(uploadInput);
  const uploadUrl = new URL(intent.uploadUrl);

  assert.equal(intent.provider, "s3");
  assert.equal(intent.method, "PUT");
  assert.equal(intent.headers?.["content-type"], "image/jpeg");
  assert.match(intent.objectKey, /^listings\/listing_1\/[a-f0-9]{12}-[a-f0-9-]+-bright-bedroom\.jpg$/);
  assert.equal(intent.publicUrl, `https://cdn.rentcity.test/uploads/${intent.objectKey}`);
  assert.equal(uploadUrl.host, "localhost:9000");
  assert.equal(uploadUrl.searchParams.get("X-Amz-Expires"), "900");
  assert.ok(uploadUrl.searchParams.get("X-Amz-Signature"));
});
