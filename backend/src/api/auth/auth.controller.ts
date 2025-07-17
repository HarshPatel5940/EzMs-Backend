import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
    UsePipes,
} from "@nestjs/common";
import { AuthDto, AuthSchema } from "../../shared/dto";
import { PublicRoute } from "../../shared/guards/auth.decorator";
import { ZodValidationPipe } from "../../shared/pipes/zodPipe";
import { AuthService } from "./auth.service";

@PublicRoute()
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    @UsePipes(new ZodValidationPipe(AuthSchema))
    signup(@Body() dto: AuthDto) {
        try {
            return this.authService.signup(dto);
        } catch (error) {
            throw new HttpException(
                "INTERNAL SERVER ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post("signin")
    @UsePipes(new ZodValidationPipe(AuthSchema))
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: AuthDto) {
        try {
            return this.authService.signin(dto);
        } catch (Error) {
            throw new HttpException(
                "INTERNAL SERVER ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
