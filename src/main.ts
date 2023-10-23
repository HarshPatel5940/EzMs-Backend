import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix("api");
    const configService = app.get(ConfigService);
    await app.listen(configService.get("PORT") || 3000);
}

bootstrap();
