import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    HttpException,
    HttpStatus,
    Param,
    ParseFilePipe,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
    UsePipes,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Express } from "express";

import {
    projectAccessDto,
    projectAccessSchema,
    projectCreateDto,
    projectCreateSchema,
    ProjectDataDto,
    projectDataSchema,
} from "../../shared/dto";
import {
    AuthRole,
    PublicRoute,
    Roles,
} from "../../shared/guards/auth.decorator";
import { ZodValidationPipe } from "../../shared/pipes/zodPipe";
import { ProjectService } from "./project.service";

@Controller("project")
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

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

    @AuthRole(Roles.Admin)
    @Post("/new")
    @UsePipes(new ZodValidationPipe(projectCreateSchema))
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

    @AuthRole(Roles.Verified)
    @Post("/:slug/data/new")
    @PublicRoute()
    @UseInterceptors(FileInterceptor("image"))
    CreateProjectData(
        @Body(new ZodValidationPipe(projectDataSchema)) dto: ProjectDataDto,
        @Param("slug") slug: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                        fileType: /image\/(jpeg|png|jpg)/,
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        try {
            return this.projectService.CreateProjectData(slug, dto, file);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @AuthRole(Roles.Admin)
    @Patch("/:slug")
    UpdateProject(
        @Param("slug") slug: string,
        @Body(new ZodValidationPipe(projectCreateSchema)) dto: projectCreateDto,
    ) {
        try {
            return this.projectService.UpdateProject(slug, dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @AuthRole(Roles.Verified)
    @Patch("/:slug/data/:id")
    UpdateProjectData(
        @Param("slug") slug: string,
        @Param("id") id: string,
        @Body(new ZodValidationPipe(projectDataSchema)) dto: ProjectDataDto,
    ) {
        try {
            return this.projectService.UpdateProjectData(slug, id, dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @AuthRole(Roles.Verified)
    @Delete("/:slug/data/:id")
    DeleteProjectData(@Param("slug") slug: string, @Param("id") id: string) {
        try {
            return this.projectService.DeleteProjectData(slug, id);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @AuthRole(Roles.Admin)
    @Delete("/:slug")
    DeleteProject(@Param("slug") dto: string) {
        try {
            return this.projectService.DeleteProject(dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @AuthRole(Roles.Admin)
    @Patch("/:slug/access")
    UpdateProjectAccess(
        @Param("slug") slug: string,
        @Body(new ZodValidationPipe(projectAccessSchema)) dto: projectAccessDto,
    ) {
        try {
            return this.projectService.UpdateProjectAccess(slug, dto);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post("/:slug/token")
    @AuthRole(Roles.Admin)
    async RegenerateToken(@Param("slug") slug: string) {
        try {
            return await this.projectService.RegenerateToken(slug);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
