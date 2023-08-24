import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Patch,
    Post,
} from "@nestjs/common";
import { UserService } from "./admin.service";
import { AuthRole, Roles } from "src/auth/guards/auth.decorator";
import { userEmailDto } from "./dto";

@Controller("admin")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch("/verify/user")
    @AuthRole(Roles.Admin)
    @HttpCode(HttpStatus.OK)
    VerifyUser(@Body() dto: userEmailDto) {
        try {
            return this.userService.VerifyUser(dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post("/new/user")
    @AuthRole(Roles.Admin)
    CreateUser(@Body() dto: userEmailDto) {
        try {
            return this.userService.CreateUser(dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
