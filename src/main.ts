import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix("api", {
        exclude: [{ path: "health", method: RequestMethod.GET }],
    });
    const configService = app.get(ConfigService);
    await app.listen(configService.get("PORT") || 3000);
}

bootstrap();
