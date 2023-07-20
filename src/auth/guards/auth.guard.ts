import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY, ROLES_KEY } from "./auth.decorator";
import { PrismaService } from "src/prisma/prisma.service";

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
        if (!RequiredRole.includes(payload.role)) {
            throw new HttpException(
                "Unauthorized access",
                HttpStatus.UNAUTHORIZED,
                {
                    cause: new Error("Unauthorized access"),
                },
            );
        }

        const res = await this.prisma.CheckUserRole(
            payload.email,
            payload.role,
        );

        return res;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
