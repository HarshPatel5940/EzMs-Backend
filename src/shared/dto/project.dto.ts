import { z } from "zod";

export const projectCreateSchema = z.object({
    projectName: z.string().min(3).max(30),
});

export const projectSchema = z.object({
    projectSlug: z.string().min(3).max(30),
    projectName: z.string().min(3).max(30),
});
export const projectAccessSchema = z.object({
    AddAccess: z.array(z.string()),
    RemoveAccess: z.array(z.string()),
});

export type projectCreateDto = z.infer<typeof projectCreateSchema>;
export type projectDto = z.infer<typeof projectSchema>;
export type projectAccessDto = z.infer<typeof projectAccessSchema>;
