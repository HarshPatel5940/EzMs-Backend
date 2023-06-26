import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
require('dotenv').config();

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
