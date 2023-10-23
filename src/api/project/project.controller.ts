import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    HttpException,
    HttpStatus,
    MaxFileSizeValidator,
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

// type ExpressFile = (new Multer()).File
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
    @UsePipes(new ZodValidationPipe(projectAccessSchema))
    UpdateProjectAccess(
        @Body() dto: projectAccessDto,
        @Param("slug") slug: string,
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

    @AuthRole(Roles.Verified)
    @Post("/:slug/data/new")
    @PublicRoute()
    @UseInterceptors(FileInterceptor("image"))
    // TODO: Fix this pipe cause it will be receiving stuff in the form of multipart body form
    // @UsePipes(new ZodValidationPipe(projectDataSchema))
    CreateProjectData(
        @Body() dto: ProjectDataDto,
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
            return this.projectService.AddProjectData(slug, dto, file);
        } catch (error) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
