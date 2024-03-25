import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PrismaService } from "../../api/database/prisma.service";
import { IS_PUBLIC_KEY, ROLES_KEY, Roles } from "./auth.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) {
            return true;
        }

        const RequiredRole = this.reflector.getAllAndOverride<string>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new HttpException(
                "Unauthorized access",
                HttpStatus.UNAUTHORIZED,
            );
        }
        const JWT_SECRET = this.config.get("JWT_SECRET");
        const JWT_ISSUER = this.config.get("JWT_ISSUER");
        let payload;
        try {
            payload = await this.jwt.verifyAsync(token, {
                secret: JWT_SECRET,
                issuer: JWT_ISSUER,
            });
        } catch {
            throw new HttpException("Invalid Token", HttpStatus.BAD_REQUEST, {
                cause: new Error("Invalid Token."),
            });
        }

        const userRole = await this.prisma.GetUserRole(payload.email);
        if (payload.role === Roles.Admin && userRole === Roles.Admin) {
            return true;
        }

        if (payload.role !== userRole) {
            throw new HttpException(
                "Token Expired. ReLogin to get a new token.",
                HttpStatus.UNAUTHORIZED,
            );
        }

        if (!RequiredRole.includes(userRole)) {
            throw new HttpException(
                "Unauthorized access",
                HttpStatus.FORBIDDEN,
                {
                    cause: new Error("Unauthorized access"),
                },
            );
        }

        return payload.role === userRole;
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
