import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class CreateContractDto {
  @ApiProperty({ example: "studio-nguyen-van-cu" })
  @IsString()
  listingId!: string;

  @ApiPropertyOptional({ example: "https://cdn.rentcity.vn/contracts/contract-123.pdf" })
  @IsOptional()
  @IsUrl({ require_tld: false })
  fileUrl?: string;
}
