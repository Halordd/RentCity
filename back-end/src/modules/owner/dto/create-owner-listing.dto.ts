import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateOwnerListingDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  address!: string;

  @IsString()
  district!: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsInt()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  deposit?: number;

  @IsInt()
  @Min(1)
  area!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  electricityFee?: string;

  @IsOptional()
  @IsString()
  waterFee?: string;

  @IsOptional()
  @IsString()
  parkingFee?: string;

  @IsOptional()
  @IsBoolean()
  petAllowed?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}
