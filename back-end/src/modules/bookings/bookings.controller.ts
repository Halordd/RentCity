import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { RescheduleBookingDto } from "./dto/reschedule-booking.dto";

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get("listings/:id/availability")
  availability(@Param("id") listingId: string) {
    return ok(this.bookingsService.availability(listingId));
  }

  @UseGuards(JwtAuthGuard)
  @Post("bookings")
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateBookingDto) {
    return ok(await this.bookingsService.create(user, body));
  }

  @UseGuards(JwtAuthGuard)
  @Patch("bookings/:id/reschedule")
  async reschedule(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: RescheduleBookingDto) {
    return ok(await this.bookingsService.reschedule(user, id, body));
  }

  @UseGuards(JwtAuthGuard)
  @Patch("bookings/:id/cancel")
  async cancel(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return ok(await this.bookingsService.cancel(user, id));
  }
}
