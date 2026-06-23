import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("metrics")
  metrics() {
    return ok(this.adminService.metrics());
  }

  @Get("verifications")
  verifications() {
    return ok(this.adminService.verifications());
  }

  @Post("verifications/:id/approve")
  approveVerification(@Param("id") id: string) {
    return ok(this.adminService.setVerificationStatus(id, "APPROVED"));
  }

  @Post("verifications/:id/request-more")
  requestMoreVerification(@Param("id") id: string) {
    return ok(this.adminService.setVerificationStatus(id, "REQUEST_MORE"));
  }

  @Post("listings/:id/review")
  reviewListing(@Param("id") id: string, @Body() body: { status: string; note?: string }) {
    return ok(this.adminService.reviewListing(id, body));
  }

  @Get("disputes")
  disputes() {
    return ok(this.adminService.disputes());
  }

  @Patch("disputes/:id")
  updateDispute(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return ok(this.adminService.updateDispute(id, body));
  }

  @Get("audit-logs")
  auditLogs() {
    return ok(this.adminService.auditLogs());
  }
}
