import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PasswordService } from "../auth/pwd.service";
import { ProjectService } from "../project/project.service";
import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";

@Module({
    imports: [CacheModule.register()],
    controllers: [PublicController],
    providers: [
        PublicService,
        ProjectService,

        // ? The Below Are dependencies of the Image Guard
        PasswordService,
        JwtService,
        ConfigService,
    ],
})
export class PublicModule {}
