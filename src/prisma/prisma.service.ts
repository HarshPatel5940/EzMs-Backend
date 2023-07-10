import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
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
}
