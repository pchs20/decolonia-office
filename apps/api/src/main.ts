import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(process.env.API_PORT ?? 3001);

  // Configure OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle("Decolonia Office API")
    .setDescription("Backend API for Decolonia Office platform")
    .setVersion("1.0")
    .addTag("Health", "Health check and connectivity verification endpoints")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error("API startup failed", error);
  process.exit(1);
});
