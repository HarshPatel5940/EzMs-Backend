import { PipeTransform, HttpException, HttpStatus } from "@nestjs/common";
import { ZodObject } from "zod";

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodObject<any>) {}

    transform(value: unknown) {
        try {
            this.schema.parse(value);
        } catch (error) {
            throw new HttpException(
                { error: "Malformed Body", message: error },
                HttpStatus.BAD_REQUEST,
            );
        }
        return value;
    }
}
