import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class projectCreateDto {
    @IsString()
    @IsNotEmpty()
    projectName: string;

    @IsString()
    @IsNotEmpty()
    teamName: string;
}

export class projectNameDto {
    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsOptional()
    projectName?: string;

    @IsString()
    @IsOptional()
    teamName?: string;
}
