import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("deposits")
  createDeposit(@Body() body: Record<string, unknown>) {
    return ok(this.paymentsService.createDeposit(body));
  }

  @Get(":id")
  detail(@Param("id") id: string) {
    return ok(this.paymentsService.detail(id));
  }

  @Post("webhook")
  webhook(@Body() body: Record<string, unknown>) {
    return ok(this.paymentsService.webhook(body));
  }
}
