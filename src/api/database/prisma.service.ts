import {
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient, Role } from "@prisma/client";
import * as argon from "argon2";
import { config } from "dotenv";
import slugify from "slugify";
import { AuthDto, projectAccessDto, ProjectDataDto } from "../../shared/dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    public isConnected: boolean = false;

    constructor(private readonly config: ConfigService) {
        super();
        const url = this.config.get("DATABASE_URL") as string;
        if (!url) {
            Logger.error("DATABASE_URL not found", "PrismaLoader");
            throw Error("[CONFIG] DATABASE_URL Not Found");
        }
        Logger.debug("DATABASE_URL Found", "PrismaLoader");

        if (
            !url.startsWith("postgres://") &&
            !url.startsWith("postgresql://")
        ) {
            Logger.error("DATABASE_URL is Not Valid", "PrismaLoader");
            Logger.debug(url, "PRISMA");
            throw Error("[CONFIG] DATABASE_URL Not Valid ");
        }
        Logger.debug("DATABASE_URL is Valid", "PrismaLoader");
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.isConnected = true;
            Logger.debug("Connected to Database", "PrismaLoader");
        } catch (error) {
            Logger.error("Could Not Connect to Database", "PrismaLoader");
            Logger.debug(error, "PRISMA");
        }
    }

    async Slugify(text: string): Promise<string> {
        if (!text) {
            Logger.error("Slugify Error | No String Provided", "Slugify");
            throw new HttpException(
                "Slugify Error | No String Provided",
                HttpStatus.BAD_REQUEST,
            );
        }

        return slugify(text, {
            lower: true,
            replacement: "-",
            trim: true,
        });
    }

    async CompareUserRole(email: string, role: Role): Promise<boolean> {
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
                "Email does not exists",
                HttpStatus.FORBIDDEN,
            );
        }

        return res.role === role;
    }

    async GetUserRole(email: string): Promise<Role> {
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
                "Email does not exists",
                HttpStatus.FORBIDDEN,
            );
        }

        return res.role;
    }

    async VerifyUser(email: string) {
        return await this.user.update({
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
    }

    async CreateProject(
        projectSlug: string,
        projectName: string,
        projectDesc: string,
        projectToken: string,
    ) {
        return await this.project.create({
            data: {
                slug: projectSlug,
                projectName: projectName,
                projectDesc: projectDesc,
                projectToken: projectToken,
            },
        });
    }

    async DeleteProject(slug: string) {
        return await this.project.update({
            where: {
                slug: slug,
            },
            data: {
                slug: `${slug}-deleted-${new Date().getMilliseconds()}`,
                isDeleted: true,
            },
            select: {
                slug: true,
                isDeleted: true,
                updatedAt: true,
            },
        });
    }

    async DeleteUser(email: string) {
        return await this.user.update({
            where: {
                email: email,
            },
            data: {
                isDeleted: true,
            },
            select: {
                email: true,
                isDeleted: true,
                updatedAt: true,
            },
        });
    }

    async UpdateProject(
        slug: string,
        projectSlug: string,
        projectName: string,
        projectDesc: string,
        newToken: string,
    ) {
        return await this.project.update({
            where: {
                slug: slug,
            },
            data: {
                slug: projectSlug,
                projectName: projectName,
                projectDesc: projectDesc,
                projectToken: newToken,
            },
            select: {
                slug: true,
                projectToken: true,
                updatedAt: true,
            },
        });
    }

    async UpdateProjectData(
        targetId: string,
        title: string,
        description: string,
        url: string | null,
    ) {
        return await this.projectData.update({
            where: {
                id: targetId,
            },
            data: {
                title: title,
                description: description,
                url: url,
            },
        });
    }

    async UpdateProjectAccess(dto: projectAccessDto, slug: string) {
        const { AddAccess, RemoveAccess } = dto;
        try {
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
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                throw new HttpException(
                    "Some of the User Does not exsist!",
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                throw new HttpException(
                    "Error while updating project access for users",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    async CreateUser(dto: AuthDto): Promise<{
        email: string;
        createdAt: Date;
    }> {
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
        const res = await this.projectData.create({
            data: {
                title: dto.title,
                description: dto.description,
                url: dto.url,
                imageUrl: url,
                project: {
                    connect: {
                        slug: slug,
                    },
                },
            },
        });

        if (!res) {
            throw new HttpException(
                `Prisma Error from AddProjectData`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        await this.project.update({
            where: {
                slug: slug,
            },
            data: {
                updatedAt: new Date(),
            },
        });
        return res;
    }

    async DeleteProjectData(slug: string, id: string) {
        const res = await this.projectData.delete({
            where: {
                id: id,
            },
            select: {
                id: true,
            },
        });

        if (!res) {
            throw new HttpException(
                `Prisma Error from DeleteProjectData`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        await this.project.update({
            where: {
                slug: slug,
            },
            data: {
                updatedAt: new Date(),
            },
        });
        return res;
    }

    async RegenerateProjectToken(slug: string, token: string) {
        return await this.project.update({
            where: {
                slug: slug,
            },
            data: {
                projectToken: token,
            },
            select: {
                projectToken: true,
                updatedAt: true,
            },
        });
    }
}
