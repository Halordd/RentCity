import { IsDateString, IsString } from "class-validator";

export class RescheduleBookingDto {
  @IsDateString()
  date!: string;

  @IsString()
  timeSlot!: string;
}
