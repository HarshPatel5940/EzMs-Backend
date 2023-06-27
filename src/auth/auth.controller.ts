import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        try {
            return this.authService.signup(dto);
        } catch (error) {
            throw new HttpException(
                'Something went wrong | INTERNAL SERVER ERROR',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}
