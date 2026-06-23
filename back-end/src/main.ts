import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyHelmet from "@fastify/helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const config = app.get(ConfigService);
  const origins = config.get<string>("FRONTEND_ORIGINS", "").split(",").map((origin) => origin.trim()).filter(Boolean);

  await app.register(fastifyHelmet);
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

  const port = config.get<number>("PORT", 4000);
  await app.listen(port);
}

void bootstrap();
