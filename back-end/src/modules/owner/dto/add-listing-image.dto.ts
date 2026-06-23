import { IsInt, IsOptional, IsString, IsUrl, Min } from "class-validator";

export class AddListingImageDto {
  @IsUrl({ require_tld: false })
  url!: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
