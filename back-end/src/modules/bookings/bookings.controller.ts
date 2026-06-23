import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { BookingsService } from "./bookings.service";

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get("listings/:id/availability")
  availability(@Param("id") listingId: string) {
    return ok(this.bookingsService.availability(listingId));
  }

  @Post("bookings")
  create(@Body() body: Record<string, unknown>) {
    return ok(this.bookingsService.create(body));
  }

  @Patch("bookings/:id/reschedule")
  reschedule(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return ok(this.bookingsService.updateStatus(id, "RESCHEDULED", body));
  }

  @Patch("bookings/:id/cancel")
  cancel(@Param("id") id: string) {
    return ok(this.bookingsService.updateStatus(id, "CANCELLED"));
  }
}
