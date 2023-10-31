import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PrismaService } from "src/api/database/prisma.service";
import { IS_PUBLIC_KEY, ROLES_KEY } from "./auth.decorator";

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
            throw new UnauthorizedException();
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

        if (payload.role === "admin") {
            return await this.prisma.CompareUserRole(
                payload.email,
                payload.role,
            );
        }

        if (!RequiredRole.includes(payload.role)) {
            throw new HttpException(
                "Unauthorized access",
                HttpStatus.UNAUTHORIZED,
                {
                    cause: new Error("Unauthorized access"),
                },
            );
        }

        return await this.prisma.CompareUserRole(payload.email, payload.role);
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
