import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto";

@Injectable()
export class PasswordService {
    constructor(
        private readonly config: ConfigService,
        private readonly jwt: JwtService,
    ) {}

    async generateRandomPassword(length: number = 12): Promise<string> {
        // noinspection SpellCheckingInspection // webstorm config
        const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=`;
        const randomBytes = await new Promise<Buffer>((resolve, reject) => {
            crypto.randomBytes(length, (err, buf) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buf);
                }
            });
        });

        if (!randomBytes) {
            throw new Error("Failed to generate random bytes.");
        }

        let password = "";
        for (let i = 0; i < length; i++) {
            const randomByte = randomBytes[i];
            if (randomByte === undefined) {
                throw new Error("Failed to generate random byte at index " + i);
            }
            password += alphabet[randomByte % alphabet.length];
        }
        return password;
    }

    async signToken(email: string, role: string) {
        const PAYLOAD = {
            email,
            role,
            generatedAt: new Date(),
        };

        const JWT_SECRET = this.config.get("JWT_SECRET");
        const JWT_ISSUER = this.config.get("JWT_ISSUER");
        const TOKEN = await this.jwt.signAsync(PAYLOAD, {
            expiresIn: "1h",
            secret: JWT_SECRET || "HelloWorld",
            issuer: JWT_ISSUER || "HelloWorld",
        });

        return {
            accessToken: TOKEN,
            createdAt: new Date(),
        };
    }

    async generateToken(s: string) {
        const PAYLOAD = {
            s,
            generatedAt: new Date(),
        };

        const JWT_SECRET = this.config.get("JWT_SECRET");
        const JWT_ISSUER = this.config.get("JWT_ISSUER");
        return await this.jwt.signAsync(PAYLOAD, {
            expiresIn: "1h",
            secret: JWT_SECRET || "HelloWorld",
            issuer: JWT_ISSUER || "HelloWorld",
        });
    }
}
