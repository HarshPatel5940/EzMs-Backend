import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PasswordService } from "src/auth/pwd.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "src/shared/guards/auth.guard";

@Module({
    imports: [],
    controllers: [ProjectController],
    providers: [
        ProjectService,
        // ? The Below Are dependencies of the AuthGuard
        JwtService,
        ConfigService,
        PasswordService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    exports: [ProjectService],
})
export class ProjectModule {}
