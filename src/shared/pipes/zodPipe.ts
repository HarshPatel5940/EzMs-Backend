import { HttpException, HttpStatus, PipeTransform } from "@nestjs/common";
import { ZodObject } from "zod";

export class ZodValidationPipe implements PipeTransform {
    private readonly schema;

    constructor(schema: ZodObject<any>) {
        this.schema = schema;
    }

    transform(value: unknown) {
        try {
            this.schema.parse(value);
        } catch (error) {
            throw new HttpException(
                {
                    error: "Malformed Body",
                    message: error,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        return value;
    }
}
