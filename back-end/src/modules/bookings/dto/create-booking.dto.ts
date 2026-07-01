import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateBookingDto {
  @IsString()
  listingId!: string;

  @IsDateString()
  date!: string;

  @IsString()
  timeSlot!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
