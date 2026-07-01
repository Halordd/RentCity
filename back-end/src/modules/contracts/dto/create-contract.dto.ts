import { IsOptional, IsString, IsUrl } from "class-validator";

export class CreateContractDto {
  @IsString()
  listingId!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  fileUrl?: string;
}
