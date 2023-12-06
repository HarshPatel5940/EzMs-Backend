import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AdminModule } from "./api/admin/admin.module";
import { AuthModule } from "./api/auth/auth.module";
import { DatabaseModule } from "./api/database/db.module";
import { HealthModule } from "./api/health/health.module";
import { ProjectModule } from "./api/project/project.module";
import { PublicModule } from "./api/public/public.module";
import { HttpLoggerMiddleware } from "./shared/middlewares/logger";

@Module({
    imports: [
        AuthModule,
        AdminModule,
        ProjectModule,
        HealthModule,
        DatabaseModule,
        PublicModule,
        CacheModule.register({ ttl: 5 * 1000 }),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HttpLoggerMiddleware).forRoutes("*");
    }
}
