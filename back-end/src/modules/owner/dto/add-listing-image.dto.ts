import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsUrl, Min } from "class-validator";

export class AddListingImageDto {
  @ApiProperty({ example: "https://images.rentcity.vn/studio-1.jpg" })
  @IsUrl({ require_tld: false })
  url!: string;

  @ApiPropertyOptional({ example: "Bedroom with large window" })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional({ example: 0, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
