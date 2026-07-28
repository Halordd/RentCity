import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateDepositDto {
  @ApiProperty({ example: "studio-nguyen-van-cu" })
  @IsString()
  listingId!: string;

  @ApiProperty({ example: 1000000, minimum: 1 })
  @IsInt()
  @Min(1)
  amount!: number;

  @ApiPropertyOptional({ example: "local" })
  @IsOptional()
  @IsString()
  provider?: string;
}
