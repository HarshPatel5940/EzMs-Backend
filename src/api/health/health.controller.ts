import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
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
        const status = this.supabase.isConnected && this.prisma.isConnected;
        if (!status) {
            Logger.error("Health Check Failed", "HealthModule");
            throw new HttpException(
                {
                    data: "Pong 🏓",
                    Status: "Some Service(s) are Unavailable",
                    timestamp: Date.now(),
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
        Logger.log(status, "HealthModule");
        return {
            data: "Pong 🏓",
            Status: "All Services Operational",
            timestamp: Date.now(),
        };
    }
}
