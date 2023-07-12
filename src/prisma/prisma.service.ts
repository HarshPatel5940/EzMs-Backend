import { Injectable } from "@nestjs/common";
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
        const res = await this.user.findFirst({
            where: {
                email: email,
                role: role,
            },
            select: {
                role: true,
            },
        });

        if (!res) {
            return false;
        }
        return true;
    }
}
