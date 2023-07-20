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
    constructor(private userService: UserService) {}

    @Post("/verify/user")
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

    @Patch("/create/user")
    @AuthRole(Roles.Admin)
    @HttpCode(HttpStatus.CREATED)
    CreateUser(@Body() dto: userEmailDto) {
        return this.userService.CreateUser(dto);
    }
}
