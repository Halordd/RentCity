import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { AuthService } from "./auth.service";
import { RequestOtpDto } from "./dto/request-otp.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@ApiTags("Auth")
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("auth/otp/request")
  async requestOtp(@Body() body: RequestOtpDto) {
    return ok(await this.authService.requestOtp(body.phone));
  }

  @Post("auth/otp/verify")
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return ok(await this.authService.verifyOtp(body.phone, body.code));
  }

  @Post("auth/logout")
  @ApiBody({ type: RefreshTokenDto, required: false })
  async logout(@Body() body: Partial<RefreshTokenDto>) {
    return ok(await this.authService.logout(body.refreshToken));
  }

  @Post("auth/refresh")
  async refresh(@Body() body: RefreshTokenDto) {
    return ok(await this.authService.refresh(body.refreshToken));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("me")
  async me(@CurrentUser() user: AuthenticatedUser) {
    return ok(await this.authService.currentUser(user.id));
  }
}
