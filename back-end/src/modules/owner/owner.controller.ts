import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { OwnerService } from "./owner.service";

@Controller("owner")
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get("listings")
  listings() {
    return ok(this.ownerService.listings());
  }

  @Post("listings")
  createListing(@Body() body: Record<string, unknown>) {
    return ok(this.ownerService.createListing(body));
  }

  @Patch("listings/:id")
  updateListing(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return ok(this.ownerService.updateListing(id, body));
  }

  @Post("listings/:id/images")
  addImage(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return ok(this.ownerService.addImage(id, body));
  }

  @Get("bookings")
  bookings() {
    return ok(this.ownerService.bookings());
  }

  @Patch("bookings/:id/confirm")
  confirmBooking(@Param("id") id: string) {
    return ok(this.ownerService.confirmBooking(id));
  }
}
