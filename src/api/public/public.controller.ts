import { CACHE_MANAGER, CacheTTL } from "@nestjs/cache-manager";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Logger,
    Param,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { PublicRoute } from "../../shared/guards/auth.decorator";
import { PublicImageGuard } from "../../shared/guards/public.guard";
import { ProjectService } from "../project/project.service";
import { Cache } from "cache-manager";
import { Request, Response } from "express";

/*
 * ATTENTION: DON'T USE THIS ENDPOINT FOR PRODUCTION
 * TL;DR: Is not Scalable For production use!
 *
 * SOLUTION:
 * Instead of using this route, MASK THE DOMAIN.... you can use a subdomain to serve images from the supabase directly...
 * Research On this more! and feel free to open an PR to update this file and improvise it.
 * */

@Controller("public/project")
export class PublicController {
    constructor(
        private readonly project: ProjectService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Get("/:slug/data/:title")
    @PublicRoute()
    @UseGuards(PublicImageGuard)
    @CacheTTL(1000)
    async GetProjectData(
        @Param("slug") slug: string,
        @Param("title") title: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response: string | undefined = await this.cacheManager.get(
            req.url,
        );

        if (response) {
            Logger.debug("Redirected Using Cache", "PublicController");
            res.redirect(response);
            return response;
        }

        const data = await this.project.GetProjectData(slug, title);

        if (!data) {
            throw new HttpException(
                `Project Not Found for ${slug} and ${title}`,
                HttpStatus.NOT_FOUND,
            );
        }
        const imageUrl = data.imageUrl;

        if (!imageUrl) {
            throw new HttpException(
                "Image URL is NULL",
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.cacheManager.set(req.url, imageUrl, 15 * 1000);
        await res.redirect(imageUrl);
        return imageUrl;
    }
}
