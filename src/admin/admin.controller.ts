import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
} from "@nestjs/common";
import { UserService } from "./admin.service";
import { AuthRole, PublicRoute, Roles } from "src/auth/guards/auth.decorator";
import { VerifyUserDto } from "./dto";

@Controller("admin")
export class UserController {
    constructor(private userService: UserService) {}

    @Post("/verify/user")
    @AuthRole(Roles.Admin)
    @HttpCode(HttpStatus.OK)
    VerifyUser(@Body() dto: VerifyUserDto) {
        try {
            // return this.userService.VerifyUser(dto);
            return "hi";
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
