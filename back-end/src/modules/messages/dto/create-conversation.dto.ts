import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateConversationDto {
  @ApiPropertyOptional({ example: "studio-nguyen-van-cu" })
  @IsOptional()
  @IsString()
  listingId?: string;

  @ApiProperty({ example: "owner-minh" })
  @IsString()
  ownerId!: string;
}
