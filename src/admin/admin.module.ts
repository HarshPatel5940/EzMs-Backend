import { Module } from "@nestjs/common";
import { UserController } from "./admin.controller";
import { UserService } from "./admin.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PasswordService } from "src/auth/pwd.service";

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
export class UserModule {}
