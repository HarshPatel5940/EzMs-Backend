import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PasswordService } from "src/api/auth/pwd.service";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { UserController } from "./admin.controller";
import { UserService } from "./admin.service";

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        // ? The Below Are dependencies of the AuthGuard
        JwtService,
        ConfigService,
        PasswordService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
//
export class UserModule {}
