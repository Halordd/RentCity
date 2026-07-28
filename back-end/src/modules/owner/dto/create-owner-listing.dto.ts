import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateOwnerListingDto {
  @ApiProperty({ example: "Studio Nguyen Van Cu" })
  @IsString()
  title!: string;

  @ApiProperty({ example: "Bright studio with balcony and full furniture." })
  @IsString()
  description!: string;

  @ApiProperty({ example: "123 Nguyen Van Cu" })
  @IsString()
  address!: string;

  @ApiProperty({ example: "Quan 7" })
  @IsString()
  district!: string;

  @ApiPropertyOptional({ example: "Ho Chi Minh City" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 5800000, minimum: 0 })
  @IsInt()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ example: 5800000, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  deposit?: number;

  @ApiProperty({ example: 28, minimum: 1 })
  @IsInt()
  @Min(1)
  area!: number;

  @ApiPropertyOptional({ example: 1, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 1, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ example: "Tang 5" })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiPropertyOptional({ example: "4k/kWh" })
  @IsOptional()
  @IsString()
  electricityFee?: string;

  @ApiPropertyOptional({ example: "100k/month" })
  @IsOptional()
  @IsString()
  waterFee?: string;

  @ApiPropertyOptional({ example: "150k/month" })
  @IsOptional()
  @IsString()
  parkingFee?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  petAllowed?: boolean;

  @ApiPropertyOptional({ example: ["May lanh", "Ban cong"], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}
