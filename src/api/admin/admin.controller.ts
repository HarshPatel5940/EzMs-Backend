import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Patch,
    Post,
    UsePipes,
} from "@nestjs/common";
import { AuthRole, Roles } from "src/shared/guards/auth.decorator";
import { userEmailDto, userEmailSchema } from "../../shared/dto";
import { ZodValidationPipe } from "../../shared/pipes/zodPipe";
import { UserService } from "./admin.service";

@Controller("admin")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch("/verify/user")
    @AuthRole(Roles.Admin)
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodValidationPipe(userEmailSchema))
    VerifyUser(@Body() dto: Omit<userEmailDto, "name">) {
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
    @UsePipes(new ZodValidationPipe(userEmailSchema))
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
