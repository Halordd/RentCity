import { Controller, Get, Param, Query } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { ListingsService } from "./listings.service";
import { SearchListingsDto } from "./dto/search-listings.dto";

@Controller("listings")
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async list(@Query() query: SearchListingsDto) {
    return ok(await this.listingsService.search(query));
  }

  @Get(":id")
  async detail(@Param("id") id: string) {
    return ok(await this.listingsService.detail(id));
  }
}
