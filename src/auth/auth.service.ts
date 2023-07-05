import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async signup(dto: AuthDto) {
        const HASH = await argon.hash(dto.password);
        const USER = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
            select: {
                email: true,
            },
        });

        if (!USER) {
            const returnUser = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: HASH,
                },
                select: {
                    email: true,
                    createdAt: true,
                },
            });
            return returnUser;
        }
        throw new HttpException(`User already exsist`, HttpStatus.FORBIDDEN);
    }

    async signin(dto: AuthDto) {
        const USER = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
            select: {
                email: true,
                hash: true,
            },
        });

        if (!USER) {
            throw new HttpException(
                `${dto.email} does not exsist`,
                HttpStatus.FORBIDDEN,
            );
        }

        const VALID = await argon.verify(USER.hash, dto.password);

        if (!VALID) {
            throw new HttpException(
                'Incorrect Credentials',
                HttpStatus.FORBIDDEN,
            );
        }

        return this.signToken(USER.email);
    }

    async signToken(email: string): Promise<{ accessToken: string }> {
        const PAYLOAD = {
            email: email,
        };
        const SECRET = this.config.get('JWT_SECRET');
        const TOKEN = await this.jwt.signAsync(PAYLOAD, {
            expiresIn: '1h',
            secret: SECRET,
        });

        return {
            accessToken: TOKEN,
        };
    }
}
