import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CompletePrivateFileUploadDto {
  @ApiPropertyOptional({ example: "sha256:..." })
  @IsOptional()
  @IsString()
  checksum?: string;
}
