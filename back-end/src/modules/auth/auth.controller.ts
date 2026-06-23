import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { AuthService } from "./auth.service";
import { RequestOtpDto } from "./dto/request-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("auth/otp/request")
  async requestOtp(@Body() body: RequestOtpDto) {
    return ok(this.authService.requestOtp(body.phone));
  }

  @Post("auth/otp/verify")
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return ok(await this.authService.verifyOtp(body.phone, body.code));
  }

  @Post("auth/logout")
  logout() {
    return ok({ success: true });
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@CurrentUser() user: AuthenticatedUser) {
    return ok(await this.authService.currentUser(user.id));
  }
}
