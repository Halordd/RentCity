import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, Length } from "class-validator";

export class VerifyOtpDto {
  @ApiProperty({ example: "+84912345678" })
  @IsString()
  @IsPhoneNumber("VN")
  phone!: string;

  @ApiProperty({ example: "123456", minLength: 6, maxLength: 6 })
  @IsString()
  @Length(6, 6)
  code!: string;
}
