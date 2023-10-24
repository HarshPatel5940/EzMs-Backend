import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
    private logger = new Logger("HTTP");

    use(request: Request, response: Response, next: NextFunction): void {
        const { hostname, method, originalUrl, body } = request;
        const userAgent = request.get("user-agent") || "";

        response.on("finish", () => {
            const { statusCode } = response;

            let logMsg = ` ${statusCode} - ${method} - ${originalUrl} - ${hostname} `;
            if (method !== "GET") {
                logMsg += `- ${JSON.stringify(body)} `;
            }
            this.logger.debug(logMsg);
        });
        next();
    }
}
