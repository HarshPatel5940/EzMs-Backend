import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    StreamableFile,
    UseGuards,
} from "@nestjs/common";
import axios from "axios";
import { PublicRoute } from "../../shared/guards/auth.decorator";
import { PublicImageGuard } from "../../shared/guards/public.guard";
import { ProjectService } from "../project/project.service";

@Controller("public/project")
export class PublicController {
    constructor(private readonly project: ProjectService) {}

    @Get("/:slug/data/:title")
    @PublicRoute()
    @UseGuards(PublicImageGuard)
    async GetProjectData(
        @Param("slug") slug: string,
        @Param("title") title: string,
    ) {
        const res = await this.project.GetProjectData(slug, title);

        if (!res) {
            throw new HttpException(
                "Project Data Not Found",
                HttpStatus.NOT_FOUND,
            );
        }
        const { imageUrl } = res;
        if (!imageUrl) {
            throw new HttpException(
                "Project Data Not Found",
                HttpStatus.NOT_FOUND,
            );
        }
        console.log(imageUrl);

        const stream = await axios.get(imageUrl, {
            responseType: "stream",
        });

        return new StreamableFile(stream.data);
    }
}
