import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { CreateDepositDto } from "./dto/create-deposit.dto";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("deposits")
  async createDeposit(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateDepositDto) {
    return ok(await this.paymentsService.createDeposit(user, body));
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async detail(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return ok(await this.paymentsService.detail(user, id));
  }

  @Post("webhook")
  async webhook(@Body() body: Record<string, unknown>) {
    return ok(await this.paymentsService.webhook(body));
  }
}
