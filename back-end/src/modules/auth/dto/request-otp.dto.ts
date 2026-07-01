import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class RequestOtpDto {
  @ApiProperty({ example: "+84912345678", description: "Vietnam phone number used for OTP login." })
  @IsString()
  @IsPhoneNumber("VN")
  phone!: string;
}
