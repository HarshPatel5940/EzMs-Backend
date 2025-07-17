import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PasswordService } from "../auth/pwd.service";
import { AuthGuard } from "../../shared/guards/auth.guard";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({
    imports: [],
    controllers: [ProjectController],
    providers: [
        ProjectService,
        // * The Below Are dependencies of the AuthGuard
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
