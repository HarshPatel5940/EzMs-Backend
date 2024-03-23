import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Patch,
    Post,
    UsePipes,
} from "@nestjs/common";
import { AuthRole, Roles } from "../../shared/guards/auth.decorator";
import { userEmailDto, userEmailSchema } from "../../shared/dto";
import { ZodValidationPipe } from "../../shared/pipes/zodPipe";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("/check")
    @AuthRole(Roles.Admin)
    @HttpCode(HttpStatus.OK)
    checkAdmin() {
        return { message: "Admin Verified Successfully" };
    }

    @Patch("/verify/user")
    @AuthRole(Roles.Admin)
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodValidationPipe(userEmailSchema))
    VerifyUser(@Body() dto: Omit<userEmailDto, "name">) {
        try {
            return this.adminService.VerifyUser(dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post("/new/user")
    @HttpCode(HttpStatus.CREATED)
    @AuthRole(Roles.Admin)
    @UsePipes(new ZodValidationPipe(userEmailSchema))
    CreateUser(@Body() dto: userEmailDto) {
        try {
            return this.adminService.CreateUser(dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post("/delete/user")
    @AuthRole(Roles.Admin)
    @UsePipes(new ZodValidationPipe(userEmailSchema))
    DeleteUser(@Body() dto: userEmailDto) {
        try {
            return this.adminService.DeleteUser(dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete("/delete/test-users")
    @AuthRole(Roles.Admin)
    DeleteTestUsers() {
        try {
            return this.adminService.DeleteTestUsers();
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete("/delete/test-projects")
    @AuthRole(Roles.Admin)
    DeleteTestProjects() {
        try {
            return this.adminService.DeleteTestProjects();
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
