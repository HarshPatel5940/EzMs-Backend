import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PasswordService } from "src/api/auth/pwd.service";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({
    imports: [],
    controllers: [ProjectController],
    providers: [
        ProjectService,
        // ? The Below Are dependencies of the AuthGuard
        JwtService,
        ConfigService,
        PasswordService,
        // TODO: Add AWS Service
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    exports: [ProjectService],
})
export class ProjectModule {}
