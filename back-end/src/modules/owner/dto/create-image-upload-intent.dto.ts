import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateImageUploadIntentDto {
  @ApiProperty({ example: "studio-bedroom.jpg" })
  @IsString()
  filename!: string;

  @ApiProperty({ example: "image/jpeg" })
  @IsString()
  contentType!: string;

  @ApiProperty({ example: 512000, minimum: 1, maximum: 10485760 })
  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024)
  sizeBytes!: number;

  @ApiPropertyOptional({ example: "Bedroom photo" })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional({ example: 1, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
