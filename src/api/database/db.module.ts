// TODO: Think of a way to merge prisma and supabase services into a singular database service
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "./prisma.service";
import { SupabaseService } from "./supabase.service";

@Global()
@Module({
    providers: [PrismaService, SupabaseService, ConfigService],
    exports: [PrismaService, SupabaseService],
})
export class DatabaseModule {}
