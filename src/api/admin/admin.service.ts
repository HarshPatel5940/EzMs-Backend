import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PasswordService } from "../../api/auth/pwd.service";
import { PrismaService } from "../../api/database/prisma.service";
import { userEmailDto } from "../../shared/dto";

@Injectable()
export class AdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pwd: PasswordService,
    ) {}

    async GetUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                email: true,
                name: true,
                role: true,
            },
        });

        if (!users) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return { message: "Users Fetched Successfully", data: users };
    }

    async VerifyUser(dto: userEmailDto) {
        const roleRes = await this.prisma.CompareUserRole(
            dto.email,
            "unverified",
        );

        if (!roleRes) {
            throw new HttpException(
                "User Already Verified",
                HttpStatus.CONFLICT,
            );
        }
        const verifyRes = await this.prisma.VerifyUser(dto.email);

        if (!verifyRes) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return { message: "User Verified Successfully", data: verifyRes };
    }

    async UnVerifyUser(dto: userEmailDto) {
        const roleRes = await this.prisma.CompareUserRole(
            dto.email,
            "verified",
        );

        if (!roleRes) {
            throw new HttpException(
                "User Already UnVerified / Is An Admin",
                HttpStatus.CONFLICT,
            );
        }
        const verifyRes = await this.prisma.UnVerifyUser(dto.email);

        if (!verifyRes) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return { message: "User UnVerified Successfully", data: verifyRes };
    }

    async CreateUser(dto: userEmailDto) {
        const USER = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { email: true },
        });

        if (USER) {
            throw new HttpException(`User already exists`, HttpStatus.CONFLICT);
        }

        const PWD = await this.pwd.generateRandomPassword();
        const createUserRes = await this.prisma.CreateUser({
            email: dto.email,
            password: PWD,
            name: dto.email.split("@")[0] || "No Name",
        });

        if (!createUserRes) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            message: "User Verified Successfully",
            data: createUserRes,
            pwd: PWD,
        };
    }

    async DeleteUser(dto: userEmailDto) {
        const USER = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { email: true },
        });

        if (!USER) {
            throw new HttpException(`User doesn't exist`, HttpStatus.NOT_FOUND);
        }

        const deleteUserRes = await this.prisma.DeleteUser(dto.email);

        if (!deleteUserRes) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            message: "User Deleted Successfully",
            data: deleteUserRes,
        };
    }

    async DeleteTestUsers() {
        const deleteUserRes = await this.prisma.user.deleteMany({
            where: { name: { startsWith: "test-" } },
        });

        if (!deleteUserRes) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            message: "Test Users Deleted Successfully",
            data: deleteUserRes,
        };
    }

    async DeleteTestProjects() {
        const deleteProjectRes = await this.prisma.project.deleteMany({
            where: { slug: { startsWith: "test" } },
        });

        if (!deleteProjectRes) {
            throw new HttpException(
                "Not able to delete test projects",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const deleteProjectDataRes = await this.prisma.projectData.deleteMany({
            where: { projectId: { startsWith: "test" } },
        });

        if (!deleteProjectDataRes) {
            throw new HttpException(
                "Not able to delete test projects data",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            message: "Test Projects and Its Data Deleted Successfully",
            data: deleteProjectRes,
        };
    }
}
