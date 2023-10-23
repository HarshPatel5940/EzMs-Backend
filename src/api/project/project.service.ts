import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Express } from "express";
import { Multer } from "multer";
import { PrismaService } from "src/prisma/prisma.service";
import {
    projectAccessDto,
    projectCreateDto,
    ProjectDataDto,
} from "../../shared/dto";
import { SupabaseService } from "../../supabase/supabase.service";

@Injectable()
export class ProjectService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly supabase: SupabaseService,
    ) {}

    async GetProject(Slug: string) {
        console.log(Slug);
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
        const projectName = dto.projectName;
        const projectSlug = await this.prisma.Slugify(projectName);
        const res = await this.GetProject(projectSlug);

        if (res) {
            throw new HttpException(
                "Project Already Exists",
                HttpStatus.CONFLICT,
            );
        }

        return await this.prisma.CreateProject({ projectName, projectSlug });
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
        console.log(slug, dto);

        try {
            const link = await this.supabase.uploadFile(file);
            console.log("=>", link);
            // TODO: Add Project Data from prisma
            // this.prisma.
        } catch (error) {
            Logger.debug(error);
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
