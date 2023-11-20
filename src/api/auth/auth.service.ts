import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as argon from "argon2";
import { PrismaService } from "src/api/database/prisma.service";
import { AuthDto } from "../../shared/dto";
import { PasswordService } from "./pwd.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pwd: PasswordService,
    ) {}

    async signup(dto: AuthDto): Promise<{
        email: string;
        createdAt: Date;
    }> {
        const USER = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
            select: {
                email: true,
            },
        });

        if (USER) {
            throw new HttpException(`User already exists`, HttpStatus.CONFLICT);
        }
        return await this.prisma.CreateUser(dto);
    }

    async signin(dto: AuthDto) {
        const USER = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
            select: {
                email: true,
                hash: true,
                role: true,
            },
        });

        if (!USER) {
            throw new HttpException(
                `${dto.email} does not exists`,
                HttpStatus.FORBIDDEN,
            );
        }

        const VALID = await argon.verify(USER.hash, dto.password);

        if (!VALID) {
            throw new HttpException(
                "Incorrect Credentials",
                HttpStatus.FORBIDDEN,
            );
        }

        return this.pwd.signToken(USER.email, USER.role);
    }
}
