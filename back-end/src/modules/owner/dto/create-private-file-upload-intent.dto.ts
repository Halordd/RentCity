import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PrivateFileCategory } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreatePrivateFileUploadIntentDto {
  @ApiProperty({ enum: PrivateFileCategory, example: PrivateFileCategory.IDENTITY_DOCUMENT })
  @IsEnum(PrivateFileCategory)
  category!: PrivateFileCategory;

  @ApiPropertyOptional({ example: "verification" })
  @IsOptional()
  @IsString()
  targetType?: string;

  @ApiPropertyOptional({ example: "verification-owner-demo" })
  @IsOptional()
  @IsString()
  targetId?: string;

  @ApiProperty({ example: "cccd-front.pdf" })
  @IsString()
  filename!: string;

  @ApiProperty({ example: "application/pdf" })
  @IsString()
  contentType!: string;

  @ApiProperty({ example: 1048576, minimum: 1, maximum: 10485760 })
  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024)
  sizeBytes!: number;
}
