import { ListingStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ReviewListingDto {
  @IsEnum(ListingStatus)
  status!: ListingStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
