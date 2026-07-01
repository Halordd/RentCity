import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { PrismaService } from "../../database/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  live() {
    return ok({
      status: "ok",
      service: "rentcity-backend",
      timestamp: new Date().toISOString()
    });
  }

  @Get("ready")
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException("Database is not ready");
    }

    return ok({
      status: "ready",
      service: "rentcity-backend",
      dependencies: {
        database: "ok"
      },
      timestamp: new Date().toISOString()
    });
  }
}
