import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateDepositDto {
  @IsString()
  listingId!: string;

  @IsInt()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsString()
  provider?: string;
}
