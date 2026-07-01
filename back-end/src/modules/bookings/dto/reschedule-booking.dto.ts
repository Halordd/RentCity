import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString } from "class-validator";

export class RescheduleBookingDto {
  @ApiProperty({ example: "2026-07-05", format: "date" })
  @IsDateString()
  date!: string;

  @ApiProperty({ example: "09:00 - 11:00" })
  @IsString()
  timeSlot!: string;
}
