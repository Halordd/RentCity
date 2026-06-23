import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { SavedService } from "./saved.service";

@Controller("me/saved-listings")
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Get()
  list() {
    return ok(this.savedService.list());
  }

  @Post(":listingId")
  save(@Param("listingId") listingId: string) {
    return ok(this.savedService.save(listingId));
  }

  @Delete(":listingId")
  remove(@Param("listingId") listingId: string) {
    return ok(this.savedService.remove(listingId));
  }
}
