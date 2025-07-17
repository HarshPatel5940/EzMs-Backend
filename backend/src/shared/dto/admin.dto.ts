import { z } from "zod";

export const userEmailSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
});

export type userEmailDto = z.infer<typeof userEmailSchema>;
