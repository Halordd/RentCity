-- CreateEnum
CREATE TYPE "PrivateFileCategory" AS ENUM ('IDENTITY_DOCUMENT', 'PROPERTY_DOCUMENT', 'CONTRACT_PDF', 'PAYMENT_RECEIPT', 'OTHER');

-- CreateEnum
CREATE TYPE "PrivateFileStatus" AS ENUM ('PENDING_UPLOAD', 'ACTIVE', 'REVOKED');

-- CreateTable
CREATE TABLE "PrivateFile" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "category" "PrivateFileCategory" NOT NULL,
    "status" "PrivateFileStatus" NOT NULL DEFAULT 'PENDING_UPLOAD',
    "targetType" TEXT,
    "targetId" TEXT,
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivateFile_objectKey_key" ON "PrivateFile"("objectKey");

-- CreateIndex
CREATE INDEX "PrivateFile_ownerId_category_createdAt_idx" ON "PrivateFile"("ownerId", "category", "createdAt");

-- CreateIndex
CREATE INDEX "PrivateFile_targetType_targetId_idx" ON "PrivateFile"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "PrivateFile" ADD CONSTRAINT "PrivateFile_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
