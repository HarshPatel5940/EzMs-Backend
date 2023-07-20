import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClient, Role, User } from "@prisma/client";
import { config } from "dotenv";
config();

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
    }

    async CheckUserRole(email: string, role: Role): Promise<boolean> {
        const res = await this.user.findUnique({
            where: {
                email: email,
            },
            select: {
                role: true,
            },
        });

        if (!res) {
            throw new HttpException(
                `${email} does not exsist`,
                HttpStatus.FORBIDDEN,
            );
        }

        if (res.role !== role) {
            return false;
        }
        return true;
    }

    async VerifyUser(
        email: string,
    ): Promise<boolean | { email: string; role: string }> {
        const res = await this.user.update({
            where: {
                email: email,
            },
            data: {
                role: "verified",
            },
            select: {
                email: true,
                role: true,
            },
        });

        if (!res) {
            return false;
        }
        return res;
    }
}
