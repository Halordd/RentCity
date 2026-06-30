import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { AddListingImageDto } from "./dto/add-listing-image.dto";
import { CreateImageUploadIntentDto } from "./dto/create-image-upload-intent.dto";
import { CreateOwnerListingDto } from "./dto/create-owner-listing.dto";
import { UpdateOwnerListingDto } from "./dto/update-owner-listing.dto";
import { OwnerService } from "./owner.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.ADMIN)
@Controller("owner")
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get("listings")
  async listings(@CurrentUser() user: AuthenticatedUser) {
    return ok(await this.ownerService.listings(user));
  }

  @Post("listings")
  async createListing(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateOwnerListingDto) {
    return ok(await this.ownerService.createListing(user, body));
  }

  @Patch("listings/:id")
  async updateListing(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: UpdateOwnerListingDto) {
    return ok(await this.ownerService.updateListing(user, id, body));
  }

  @Post("listings/:id/images")
  async addImage(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: AddListingImageDto) {
    return ok(await this.ownerService.addImage(user, id, body));
  }

  @Post("listings/:id/images/upload-intent")
  async createImageUploadIntent(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: CreateImageUploadIntentDto) {
    return ok(await this.ownerService.createImageUploadIntent(user, id, body));
  }

  @Get("bookings")
  async bookings(@CurrentUser() user: AuthenticatedUser) {
    return ok(await this.ownerService.bookings(user));
  }

  @Patch("bookings/:id/confirm")
  async confirmBooking(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return ok(await this.ownerService.confirmBooking(user, id));
  }
}
