import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AdminModule } from "./api/admin/admin.module";
import { AuthModule } from "./api/auth/auth.module";
import { DatabaseModule } from "./api/database/db.module";
import { HealthModule } from "./api/health/health.module";
import { ProjectModule } from "./api/project/project.module";
import { HttpLoggerMiddleware } from "./shared/middlewares/logger";

@Module({
    imports: [
        AuthModule,
        AdminModule,
        ProjectModule,
        HealthModule,
        DatabaseModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HttpLoggerMiddleware).forRoutes("*");
    }
}
