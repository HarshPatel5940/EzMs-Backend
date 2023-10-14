import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient, Role } from "@prisma/client";
import * as argon from "argon2";
import { config } from "dotenv";
import slugify from "slugify";
import {
    AuthDto,
    projectAccessDto,
    ProjectDataDto,
    projectDto,
} from "../shared/dto";

config();

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private readonly config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get("DATABASE_URL"),
                },
            },
        });
    }

    async Slugify(text: string): Promise<string> {
        const res = slugify(text, {
            lower: true,
            replacement: "-",
            trim: true,
        });
        if (!text) {
            throw new Error("No text provided");
        }

        return res;
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
                `${email} does not exists`,
                HttpStatus.FORBIDDEN,
            );
        }

        return res.role === role;
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

    async CreateProject({
        projectName,
        projectSlug,
    }: projectDto): Promise<boolean | { slug: string; createdAt: Date }> {
        const res = await this.project.create({
            data: {
                slug: projectSlug,
                projectName: projectName,
            },
            select: {
                slug: true,
                createdAt: true,
            },
        });

        if (!res) {
            return false;
        }
        return res;
    }

    async DeleteProject(slug: string): Promise<boolean> {
        const res = await this.project.delete({
            where: {
                slug: slug,
            },
        });

        return !!res;
    }

    async UpdateProjectAccess(
        dto: projectAccessDto,
        slug: string,
    ): Promise<{ data: projectAccessDto; updatedAt: Date }> {
        const { AddAccess, RemoveAccess } = dto;

        const { updatedAt } = await this.project.update({
            where: {
                slug: slug,
            },
            data: {
                users: {
                    connect: AddAccess.map((email) => ({
                        email: email,
                    })),
                    disconnect: RemoveAccess.map((email) => ({
                        email: email,
                    })),
                },
            },
            select: {
                updatedAt: true,
            },
        });

        return { data: dto, updatedAt: updatedAt };
    }

    async CreateUser(
        dto: AuthDto,
    ): Promise<{ email: string; createdAt: Date }> {
        const HASH = await argon.hash(dto.password);
        const res = await this.user.create({
            data: {
                email: dto.email,
                hash: HASH,
                name: dto.name,
            },
            select: {
                email: true,
                createdAt: true,
            },
        });

        if (!res) {
            throw new HttpException(
                `Prisma Error from CreateUser`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return res;
    }

    async AddProjectData(slug: string, dto: ProjectDataDto, url: string) {
        const res = await this.project.create({
            data: {
            
            },
            select: {},
        });
    }
}
