import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./admin/admin.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
    imports: [AuthModule, UserModule, PrismaModule],
    // controllers: [],
    // providers: [],
})
export class AppModule {}
