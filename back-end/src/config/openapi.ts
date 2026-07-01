import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from "@nestjs/swagger";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { env } from "node:process";

export function createOpenApiDocument(app: NestFastifyApplication): OpenAPIObject {
  return SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("RentCity Backend API")
      .setDescription("REST API contract for RentCity web, mobile app, and phone-based web app clients.")
      .setVersion(env.RENTCITY_API_VERSION || env.npm_package_version || "0.2.4")
      .addBearerAuth()
      .addServer("http://localhost:4000", "Local development")
      .build()
  );
}

export function setupOpenApi(app: NestFastifyApplication, config: ConfigService): void {
  const docsEnabled = config.get<boolean>("API_DOCS_ENABLED", config.get<string>("NODE_ENV") !== "production");
  if (!docsEnabled) return;

  const document = createOpenApiDocument(app);

  SwaggerModule.setup("api-docs", app, document, {
    jsonDocumentUrl: "api-docs.json",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  });
}
