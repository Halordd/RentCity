import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { RescheduleBookingDto } from "./dto/reschedule-booking.dto";

@ApiTags("Bookings")
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get("listings/:id/availability")
  async availability(@Param("id") listingId: string) {
    return ok(await this.bookingsService.availability(listingId));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("me/bookings")
  async myBookings(@CurrentUser() user: AuthenticatedUser) {
    return ok(await this.bookingsService.myBookings(user));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("bookings")
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateBookingDto) {
    return ok(await this.bookingsService.create(user, body));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("bookings/:id/reschedule")
  async reschedule(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: RescheduleBookingDto) {
    return ok(await this.bookingsService.reschedule(user, id, body));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("bookings/:id/cancel")
  async cancel(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return ok(await this.bookingsService.cancel(user, id));
  }
}
