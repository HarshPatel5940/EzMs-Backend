import { Controller, Get } from "@nestjs/common";
import { PublicRoute } from "../../shared/guards/auth.decorator";

@Controller("health")
export class HealthController {
    constructor() {}

    @Get()
    @PublicRoute()
    async check() {
        return {
            status: "ok",
            uptime: process.uptime(),
        };
    }
}
