import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { AuthRole, Roles } from "src/auth/guards/auth.decorator";
import { projectCreateDto } from "./dto";

@Controller("project")
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @AuthRole(Roles.Admin)
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
}
