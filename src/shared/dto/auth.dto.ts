import { z } from "zod";

export const AuthSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().optional(),
});

export type AuthDto = z.infer<typeof AuthSchema>;
