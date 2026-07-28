import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateBookingDto {
  @ApiProperty({ example: "studio-nguyen-van-cu" })
  @IsString()
  listingId!: string;

  @ApiProperty({ example: "2026-07-04", format: "date" })
  @IsDateString()
  date!: string;

  @ApiProperty({ example: "14:30 - 16:00" })
  @IsString()
  timeSlot!: string;

  @ApiPropertyOptional({ example: "Can I view this listing after work?" })
  @IsOptional()
  @IsString()
  note?: string;
}
