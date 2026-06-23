import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { ContractsService } from "./contracts.service";

@Controller("contracts")
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return ok(this.contractsService.create(body));
  }

  @Get(":id")
  detail(@Param("id") id: string) {
    return ok(this.contractsService.detail(id));
  }
}
