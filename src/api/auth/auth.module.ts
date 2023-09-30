import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { PasswordService } from "./pwd.service";

@Module({
    imports: [ConfigModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, PasswordService],
    exports: [AuthService, PasswordService],
})
export class AuthModule {}
