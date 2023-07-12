import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthRole, PublicRoute, Roles } from "src/auth/auth/auth.decorator";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Get("me")
    @AuthRole(Roles.Verified)
    GetYourself() {
        return "Route Accessible";
    }
}
