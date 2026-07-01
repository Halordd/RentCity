import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";

const outputPath = resolve(process.cwd(), "..", "docs", "api", "openapi.json");
const checkOnly = process.argv.includes("--check");

async function generateOpenApiJson(): Promise<string> {
  process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/rentcity?schema=public";
  process.env.JWT_SECRET ??= "openapi-generation-only-secret";
  process.env.PAYMENT_WEBHOOK_SECRET ??= "openapi-generation-only-payment-secret";
  process.env.API_DOCS_ENABLED ??= "true";
  process.env.NODE_ENV ??= "development";
  process.env.SKIP_PRISMA_CONNECT = "true";

  const [{ AppModule }, { createOpenApiDocument }] = await Promise.all([
    import("../src/app.module"),
    import("../src/config/openapi")
  ]);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    abortOnError: false,
    logger: false
  });
  const document = createOpenApiDocument(app);
  await app.close();

  return `${JSON.stringify(document, null, 2)}\n`;
}

async function main(): Promise<void> {
  const nextJson = await generateOpenApiJson();

  if (checkOnly) {
    const currentJson = await readFile(outputPath, "utf8").catch(() => "");
    if (currentJson !== nextJson) {
      throw new Error("docs/api/openapi.json is not current. Run `npm run api:generate` from the repository root.");
    }
    console.log("OpenAPI contract is current.");
    return;
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, nextJson, "utf8");
  console.log(`OpenAPI contract written to ${outputPath}`);
}

void main().catch((error) => {
  if (error instanceof Error) {
    console.error(error.stack || error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
