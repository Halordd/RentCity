import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyHelmet from "@fastify/helmet";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { RequestIdInterceptor } from "./common/interceptors/request-id.interceptor";
import { setupOpenApi } from "./config/openapi";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const config = app.get(ConfigService);
  const origins = config.get<string>("FRONTEND_ORIGINS", "").split(",").map((origin) => origin.trim()).filter(Boolean);

  await app.register(fastifyHelmet);
  app.enableShutdownHooks();
  app.enableCors({
    origin: origins.length ? origins : true,
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
  app.useGlobalInterceptors(new RequestIdInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  setupOpenApi(app, config);

  const port = config.get<number>("PORT", 4000);
  await app.listen(port, "0.0.0.0");
}

void bootstrap();
