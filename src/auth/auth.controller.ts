import { Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Req() req: Request, @Res() res: Response) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Missing email or password');
        }

        this.authService.signup(req.body.email, req.body.password);
        return res.status(200).send('Signup successful');
    }

    @Post('signin')
    signin() {
        return this.authService.signin();
    }
}
