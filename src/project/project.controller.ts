import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { AuthRole, Roles } from "src/shared/guards/auth.decorator";
import { projectCreateDto } from "../shared/dto";

@Controller("project")
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @AuthRole(Roles.Verified, Roles.Admin)
    @Post("/new")
    CreateProject(@Body() dto: projectCreateDto) {
        try {
            return this.projectService.CreateProject(dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @AuthRole(Roles.Verified, Roles.Admin)
    @Get("/:slug")
    GetProject(@Param("slug") dto: string) {
        try {
            return this.projectService.GetProject(dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @AuthRole(Roles.Verified, Roles.Admin)
    @Get("/")
    GetAllProjects() {
        try {
            return this.projectService.GetAllProjects();
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
