import { Controller, Get, Logger } from "@nestjs/common";
import { PublicRoute } from "../../shared/guards/auth.decorator";
import { PrismaService } from "../database/prisma.service";
import { SupabaseService } from "../database/supabase.service";

@Controller("health")
export class HealthController {
    constructor(
        private readonly supabase: SupabaseService,
        private readonly prisma: PrismaService,
    ) {}

    @Get()
    @PublicRoute()
    async check() {
        const status =
            this.supabase.isConnected && this.prisma.isConnected
                ? "All Services Operational"
                : "Few Services Not Operational";

        Logger.log(status, "HealthModule");
        return {
            data: "Pong 🏓",
            Status: status,
            timestamp: Date.now(),
        };
    }
}
