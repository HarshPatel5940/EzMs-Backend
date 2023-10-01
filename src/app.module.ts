import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserModule } from "./api/admin/admin.module";
import { AuthModule } from "./api/auth/auth.module";
import { ProjectModule } from "./api/project/project.module";
import { PrismaModule } from "./prisma/prisma.module";
import { LoggerMiddleware } from "./shared/middlewares/logger";

@Module({
    imports: [AuthModule, UserModule, PrismaModule, ProjectModule],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes("*");
    }
}
