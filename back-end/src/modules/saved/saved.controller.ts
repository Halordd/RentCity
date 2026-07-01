import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { SavedService } from "./saved.service";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags("Saved Listings")
@Controller("me/saved-listings")
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser) {
    return ok(await this.savedService.list(user.id));
  }

  @Post(":listingId")
  async save(@CurrentUser() user: AuthenticatedUser, @Param("listingId") listingId: string) {
    return ok(await this.savedService.save(user.id, listingId));
  }

  @Delete(":listingId")
  async remove(@CurrentUser() user: AuthenticatedUser, @Param("listingId") listingId: string) {
    return ok(await this.savedService.remove(user.id, listingId));
  }
}
