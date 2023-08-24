import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { projectCreateDto, projectNameDto } from "./dto";

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
                teamName: true,
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
        const projectSlug = await this.prisma.Slugify(
            `${dto.projectName} ${dto.teamName}`,
        );

        const res = await this.GetProject(projectSlug);

        if (res) {
            throw new HttpException(
                "Project Already Exsist",
                HttpStatus.CONFLICT,
            );
        }

        return await this.prisma.CreateProject(
            projectSlug,
            dto.projectName,
            dto.teamName,
        );
    }
}
