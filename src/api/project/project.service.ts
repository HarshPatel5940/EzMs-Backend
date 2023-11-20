import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Express } from "express";
import { PrismaService } from "src/api/database/prisma.service";
import {
    projectAccessDto,
    projectCreateDto,
    ProjectDataDto,
} from "../../shared/dto";
import { SupabaseService } from "../database/supabase.service";

@Injectable()
export class ProjectService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly supabase: SupabaseService,
    ) {}

    async GetProject(Slug: string) {
        const PROJECT = await this.prisma.project.findUnique({
            where: {
                slug: `${Slug}`,
            },
            select: {
                slug: true,
                projectName: true,
                projectData: true,
                users: true,
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

        const targetRes = res.projectData.find((data) => {
            if (data.projectId === slug && data.title === title) {
                return data;
            }
        });

        if (!targetRes) {
            throw new HttpException(
                "Project Data Not Found",
                HttpStatus.NOT_FOUND,
            );
        }

        return targetRes.id;
    }

    async GetAllProjects() {
        const PROJECTS = await this.prisma.project.findMany({
            select: {
                slug: true,
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

        return await this.prisma.CreateProject(
            projectSlug,
            projectName,
            projectDesc,
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

        return await this.prisma.UpdateProject(
            slug,
            projectSlug,
            projectName,
            projectDesc,
        );
    }

    async UpdateProjectData(slug: string, id: string, dto: ProjectDataDto) {
        const { title, description, url } = dto;

        const targetRes = await this.GetProjectData(slug, id);

        if (!targetRes) {
            throw new HttpException(
                "Project Data Not Found",
                HttpStatus.NOT_FOUND,
            );
        }

        return await this.prisma.UpdateProjectData(
            targetRes,
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

        return await this.prisma.UpdateProjectAccess(dto, Slug);
    }

    async AddProjectData(
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
        await this.prisma.AddProjectData(slug, dto, link);
        return { ...dto, ImageUrl: link };
    }
}
