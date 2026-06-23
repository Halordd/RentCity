import { Body, Controller, Get, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("auth/otp/request")
  requestOtp(@Body() body: { phone: string }) {
    return ok(this.authService.requestOtp(body.phone));
  }

  @Post("auth/otp/verify")
  verifyOtp(@Body() body: { phone: string; code: string }) {
    return ok(this.authService.verifyOtp(body.phone, body.code));
  }

  @Post("auth/logout")
  logout() {
    return ok({ success: true });
  }

  @Get("me")
  me() {
    return ok(this.authService.currentUser());
  }
}
