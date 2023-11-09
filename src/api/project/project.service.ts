import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
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

    async UpdateProjectData(slug: string, dto: ProjectDataDto) {
        const { title, description, url } = dto;

        return await this.prisma.UpdateProjectData(
            slug,
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
        try {
            const link = await this.supabase.uploadFile(file);
            await this.prisma.AddProjectData(slug, dto, link);
            return { ...dto, ImageUrl: link };
        } catch (error) {
            Logger.debug(error);
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
