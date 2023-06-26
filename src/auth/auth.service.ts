import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    signup(email: string, password: string) {
        console.log(email, password);
        return 'This is a sample response for signup';
    }

    signin() {
        return 'This is a sample response for signin';
    }
}
