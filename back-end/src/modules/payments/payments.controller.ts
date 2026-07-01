import { Body, Controller, Get, Headers, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { CreateDepositDto } from "./dto/create-deposit.dto";
import { PaymentWebhookDto } from "./dto/payment-webhook.dto";
import { PaymentsService } from "./payments.service";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("deposits")
  async createDeposit(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateDepositDto) {
    return ok(await this.paymentsService.createDeposit(user, body));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(":id")
  async detail(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return ok(await this.paymentsService.detail(user, id));
  }

  @Post("webhook")
  async webhook(@Body() body: PaymentWebhookDto, @Headers("x-rentcity-signature") signature?: string) {
    return ok(await this.paymentsService.webhook(body, signature));
  }
}
