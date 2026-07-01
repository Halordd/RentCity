import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ListingStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ReviewListingDto {
  @ApiProperty({ enum: ListingStatus, example: ListingStatus.PUBLISHED })
  @IsEnum(ListingStatus)
  status!: ListingStatus;

  @ApiPropertyOptional({ example: "Photos and pricing look valid." })
  @IsOptional()
  @IsString()
  note?: string;
}
