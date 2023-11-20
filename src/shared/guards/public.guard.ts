import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "src/api/database/prisma.service";

@Injectable()
export class PublicImageGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException("No Token Provided");
        }

        const { slug } = request.params;
        const projectToken = (await this.prisma.project.findUnique({
            where: {
                slug: slug,
            },
            select: {
                projectToken: true,
            },
        })) || { projectToken: "" };

        const response = projectToken.projectToken === token;
        if (!response) {
            throw new UnauthorizedException(
                "You are not authorized to view this project data",
            );
        }
        return response;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const { authorization } = request.headers;
        if (!authorization) {
            return undefined;
        }
        const [type, token] = authorization.split(" ");
        return type === "Bearer" ? token : undefined;
    }
}
