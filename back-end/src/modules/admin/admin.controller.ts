import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { ReviewListingDto } from "./dto/review-listing.dto";
import { UpdateDisputeDto } from "./dto/update-dispute.dto";
import { AdminService } from "./admin.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("metrics")
  async metrics() {
    return ok(await this.adminService.metrics());
  }

  @Get("verifications")
  async verifications() {
    return ok(await this.adminService.verifications());
  }

  @Get("listings")
  async listings() {
    return ok(await this.adminService.listings());
  }

  @Post("verifications/:id/approve")
  async approveVerification(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return ok(await this.adminService.setVerificationStatus(user, id, "APPROVED"));
  }

  @Post("verifications/:id/request-more")
  async requestMoreVerification(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return ok(await this.adminService.setVerificationStatus(user, id, "REQUEST_MORE"));
  }

  @Post("listings/:id/review")
  async reviewListing(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: ReviewListingDto) {
    return ok(await this.adminService.reviewListing(user, id, body));
  }

  @Get("disputes")
  async disputes() {
    return ok(await this.adminService.disputes());
  }

  @Patch("disputes/:id")
  async updateDispute(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: UpdateDisputeDto) {
    return ok(await this.adminService.updateDispute(user, id, body));
  }

  @Get("audit-logs")
  async auditLogs() {
    return ok(await this.adminService.auditLogs());
  }
}
