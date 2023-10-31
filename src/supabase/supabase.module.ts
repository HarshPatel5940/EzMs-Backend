import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../api/database/prisma.service";

@Global()
@Module({
    providers: [ConfigService, PrismaService],
    exports: [PrismaService],
})
export class SupabaseModule {}
