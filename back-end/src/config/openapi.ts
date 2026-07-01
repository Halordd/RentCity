import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

export function setupOpenApi(app: NestFastifyApplication, config: ConfigService): void {
  const docsEnabled = config.get<boolean>("API_DOCS_ENABLED", config.get<string>("NODE_ENV") !== "production");
  if (!docsEnabled) return;

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("RentCity Backend API")
      .setDescription("REST API contract for RentCity web, mobile app, and phone-based web app clients.")
      .setVersion("0.1.0")
      .addBearerAuth()
      .addServer("http://localhost:4000", "Local development")
      .build()
  );

  SwaggerModule.setup("api-docs", app, document, {
    jsonDocumentUrl: "api-docs.json",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  });
}
