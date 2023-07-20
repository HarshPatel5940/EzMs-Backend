import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UserService } from "./admin.service";
import { AuthRole, PublicRoute, Roles } from "src/auth/guards/auth.decorator";
import { VerifyUserDto } from "./dto";

@Controller("admin")
export class UserController {
    constructor(private userService: UserService) {}

    @Post("/verify/user")
    @HttpCode(HttpStatus.OK)
    @AuthRole(Roles.Admin)
    VerifyUser(@Body() dto: VerifyUserDto) {
        return this.userService.VerifyUser(dto);
    }
}
