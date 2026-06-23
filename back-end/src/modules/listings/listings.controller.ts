import { Controller, Get, Param, Query } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { ListingsService } from "./listings.service";

@Controller("listings")
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  list(@Query() query: Record<string, string>) {
    return ok(this.listingsService.search(query));
  }

  @Get(":id")
  detail(@Param("id") id: string) {
    return ok(this.listingsService.detail(id));
  }
}
