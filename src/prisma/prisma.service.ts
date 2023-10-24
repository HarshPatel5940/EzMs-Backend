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
import {
    AuthDto,
    projectAccessDto,
    ProjectDataDto,
    projectDto,
} from "../shared/dto";

config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(private readonly config: ConfigService) {
        super();
        const url = this.config.get("DATABASE_URL") as string;
        if (!url) {
            Logger.error("DATABASE_URL not found", "PrismaLoader");
            throw Error("[CONFIG] DATABASE_URL Not Found");
        }
        Logger.debug("DATABASE_URL Found", "PrismaLoader");

        if (!url.startsWith("postgres://")) {
            Logger.error("DATABASE_URL is Not Valid", "PrismaLoader");
            Logger.debug(url, "PRISMA");
            throw Error("[CONFIG] DATABASE_URL Not Valid ");
        }
        Logger.debug("DATABASE_URL is Valid", "PrismaLoader");
    }

    async onModuleInit() {
        try {
            await this.$connect();
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
                "Email does not exists",
                HttpStatus.FORBIDDEN,
            );
        }

        return res.role === role;
    }

    async VerifyUser(email: string): Promise<
        | boolean
        | {
              email: string;
              role: string;
          }
    > {
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

    async CreateProject({ projectName, projectSlug }: projectDto): Promise<
        | boolean
        | {
              slug: string;
              createdAt: Date;
          }
    > {
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
    ): Promise<{
        data: projectAccessDto;
        updatedAt: Date;
    }> {
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
            select: {
                imageUrl: true,
            },
        });

        if (!res) {
            throw new HttpException(
                `Prisma Error from AddProjectData`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return res;
    }
}
