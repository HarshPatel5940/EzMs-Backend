import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { ProjectData } from "@prisma/client";

import {
    projectAccessDto,
    projectCreateDto,
    ProjectDataDto,
} from "../../shared/dto";
import { PasswordService } from "../auth/pwd.service";
import { SupabaseService } from "../database/supabase.service";

@Injectable()
export class ProjectService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly supabase: SupabaseService,
        private readonly pwd: PasswordService,
    ) {}

    async GetProject(Slug: string) {
        const PROJECT = await this.prisma.project.findUnique({
            where: {
                slug: `${Slug}`,
                isDeleted: false,
            },
            select: {
                slug: true,
                projectName: true,
                projectDesc: true,
                projectToken: true,
                projectData: true,
                users: {
                    select: {
                        email: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!PROJECT) {
            return false;
        }
        return PROJECT;
    }

    async GetProjectData(slug: string, title: string) {
        const res = await this.prisma.project.findUnique({
            where: {
                slug: slug,
            },
            select: {
                projectData: true,
            },
        });

        if (!res) {
            throw new HttpException("Project Not Found", HttpStatus.NOT_FOUND);
        }

        const targetRes = res.projectData.find((data: ProjectData) => {
            if (data.projectId === slug && data.title === title) {
                return data;
            }
        });

        if (!targetRes) {
            return false;
        }

        return targetRes;
    }

    async GetAllProjects() {
        const PROJECTS = await this.prisma.project.findMany({
            where: {
                isDeleted: false,
            },
            select: {
                slug: true,
                projectName: true,
                projectDesc: true,
                projectData: {
                    select: {
                        title: true,
                    },
                },
                updatedAt: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        if (!PROJECTS) {
            return false;
        }

        return PROJECTS;
    }

    async CreateProject(dto: projectCreateDto) {
        const { projectName, projectDesc } = dto;
        const projectSlug = await this.prisma.Slugify(projectName);
        const res = await this.GetProject(projectSlug);

        if (res) {
            throw new HttpException(
                "Project Already Exists",
                HttpStatus.CONFLICT,
            );
        }
        const token = await this.pwd.generateToken(projectSlug);

        return await this.prisma.CreateProject(
            projectSlug,
            projectName,
            projectDesc,
            token,
        );
    }

    async UpdateProject(slug: string, dto: projectCreateDto) {
        const { projectName, projectDesc } = dto;
        const projectSlug = await this.prisma.Slugify(projectName);
        const res = await this.GetProject(projectSlug);
        const res1 = await this.GetProject(slug);

        if (!res1) {
            throw new HttpException("Project Not Found", HttpStatus.NOT_FOUND);
        }

        if (res) {
            throw new HttpException(
                "Project With the New Name Already Exists",
                HttpStatus.CONFLICT,
            );
        }
        const newToken = await this.pwd.generateToken(projectSlug);
        return await this.prisma.UpdateProject(
            slug,
            projectSlug,
            projectName,
            projectDesc,
            newToken,
        );
    }

    async UpdateProjectData(
        slug: string,
        old_title: string,
        dto: ProjectDataDto,
    ) {
        const { title, description, url } = dto;

        const res = await this.GetProjectData(slug, old_title);
        if (!res) {
            throw new HttpException(
                "Project Data Not Found",
                HttpStatus.NOT_FOUND,
            );
        }
        const id = res.id;

        if (!id) {
            throw new HttpException(
                "Project Data Not Found",
                HttpStatus.NOT_FOUND,
            );
        }

        return await this.prisma.UpdateProjectData(
            id,
            title,
            description || "No Description Provided",
            url || "No Url Provided",
        );
    }

    async DeleteProject(Slug: string) {
        const PROJECT = await this.GetProject(Slug);

        if (!PROJECT) {
            throw new HttpException("Project Not Found", HttpStatus.NOT_FOUND);
        }

        return await this.prisma.DeleteProject(Slug);
    }

    async DeleteProjectData(Slug: string, id: string) {
        const PROJECT = await this.GetProject(Slug);

        if (!PROJECT) {
            throw new HttpException("Project Not Found", HttpStatus.NOT_FOUND);
        }

        return await this.prisma.DeleteProjectData(Slug, id);
    }

    async UpdateProjectAccess(Slug: string, dto: projectAccessDto) {
        const PROJECT = await this.GetProject(Slug);
        if (!PROJECT) {
            throw new HttpException("Project Not Found", HttpStatus.NOT_FOUND);
        }

        const res = await this.prisma.UpdateProjectAccess(dto, Slug);

        if (!res) {
            throw new HttpException(
                "Error Updating Project Access",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return res;
    }

    async CreateProjectData(
        slug: string,
        dto: ProjectDataDto,
        file: Express.Multer.File,
    ) {
        const link = await this.supabase.uploadFile(file);
        const res = await this.GetProjectData(slug, dto.title);
        if (res) {
            throw new HttpException(
                "Project Data Already Exists",
                HttpStatus.CONFLICT,
            );
        }
        return await this.prisma.AddProjectData(slug, dto, link);
    }

    async RegenerateToken(slug: string) {
        const PROJECT = await this.GetProject(slug);
        if (!PROJECT) {
            throw new HttpException("Project Not Found", HttpStatus.NOT_FOUND);
        }
        const newToken = await this.pwd.generateToken(slug);
        return await this.prisma.RegenerateProjectToken(slug, newToken);
    }
}
