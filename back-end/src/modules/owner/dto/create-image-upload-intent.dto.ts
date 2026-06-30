import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateImageUploadIntentDto {
  @IsString()
  filename!: string;

  @IsString()
  contentType!: string;

  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024)
  sizeBytes!: number;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
