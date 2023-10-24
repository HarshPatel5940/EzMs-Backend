import { SetMetadata } from "@nestjs/common";

export enum Roles {
    Verified = "verified",
    Admin = "admin",
}

export const ROLES_KEY = "roles";
export const AuthRole = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);

export const IS_PUBLIC_KEY = "isPublic";
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);
