import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({ example: "rc_refresh_session_secret" })
  @IsString()
  refreshToken!: string;
}
