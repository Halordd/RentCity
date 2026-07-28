import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class SearchListingsDto {
  @ApiPropertyOptional({ example: "Quan 7" })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: "studio ban cong" })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ example: 3000000, minimum: 0, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 9000000, minimum: 0, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 25, minimum: 0, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minArea?: number;

  @ApiPropertyOptional({ example: true, type: Boolean })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  petAllowed?: boolean;

  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100, default: 20, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
