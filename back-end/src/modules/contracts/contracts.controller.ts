import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { CreateContractDto } from "./dto/create-contract.dto";
import { ContractsService } from "./contracts.service";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags("Contracts")
@Controller("contracts")
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateContractDto) {
    return ok(await this.contractsService.create(user, body));
  }

  @Get(":id")
  async detail(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return ok(await this.contractsService.detail(user, id));
  }
}
