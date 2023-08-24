import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { projectCreateDto, projectNameDto } from "./dto";

@Injectable()
export class ProjectService {
    constructor(private readonly prisma: PrismaService) {}

    async checkProjectExsist(projectSlug: string): Promise<boolean> {
        const PROJECT = await this.prisma.project.findFirst({
            where: {
                slug: projectSlug,
            },
            select: {
                slug: true,
            },
        });

        if (!PROJECT) {
            return false;
        }
        return true;
    }

    async CreateProject(dto: projectCreateDto) {
        const projectSlug = await this.prisma.Slugify(
            `${dto.projectName} ${dto.teamName}`,
        );

        const res = await this.checkProjectExsist(projectSlug);

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
