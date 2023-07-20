import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class PasswordService {
    async generateRandomPassword(length: number = 12): Promise<string> {
        const alphabet =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=";
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
}
