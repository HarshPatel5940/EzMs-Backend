import { Controller, Get } from "@nestjs/common";
import { PublicRoute } from "../../shared/guards/auth.decorator";

@Controller("health")
export class HealthController {
    constructor() {}

    @Get()
    @PublicRoute()
    async check() {
        // TODO: Implement Public Property of Services and showcase it here
        return {
            status: "ok",
            timestamp: Date.now(),
        };
    }
}
