import { IsPhoneNumber, IsString } from "class-validator";

export class RequestOtpDto {
  @IsString()
  @IsPhoneNumber("VN")
  phone!: string;
}
