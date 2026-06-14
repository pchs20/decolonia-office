import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(process.env.API_PORT ?? 3001);

  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error("API startup failed", error);
  process.exit(1);
});
