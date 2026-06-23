import { IsOptional, IsString } from "class-validator";

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  listingId?: string;

  @IsString()
  ownerId!: string;
}
