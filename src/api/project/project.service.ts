import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Express } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import {
    projectAccessDto,
    projectCreateDto,
    ProjectDataDto,
} from "../../shared/dto";

@Injectable()
export class ProjectService {
    constructor(private readonly prisma: PrismaService) {}

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
        const PROJECT = await this.prisma.project.findUnique({
            where: {
                slug: `${Slug}`,
            },
            select: {
                slug: true,
            },
        });

        if (!PROJECT) {
            throw new HttpException("Project Not Found", HttpStatus.NOT_FOUND);
        }

        return await this.prisma.DeleteProject(Slug);
    }

    async UpdateProjectAccess(slug: string, dto: projectAccessDto) {
        const PROJECT = await this.prisma.project.findUnique({
            where: {
                slug: `${slug}`,
            },
            select: {
                slug: true,
            },
        });

        if (!PROJECT) {
            throw new HttpException("Project Not Found", HttpStatus.NOT_FOUND);
        }

        return await this.prisma.UpdateProjectAccess(dto, slug);
    }

    async AddProjectData(
        slug: string,
        dto: ProjectDataDto,
        file: Express.Multer.File,
    ) {
        console.log(slug, dto, file);

        // TODO: Upload Project Data to S3
        // this.aws.
        // TODO: Add Project Data from prisma
        // this.prisma.
    }
}
