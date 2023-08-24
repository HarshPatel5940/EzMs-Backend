import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./admin/admin.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProjectModule } from "./project/project.module";

@Module({
    imports: [AuthModule, UserModule, PrismaModule, ProjectModule],
})
export class AppModule {}
