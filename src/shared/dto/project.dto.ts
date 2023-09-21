import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class projectCreateDto {
    @IsString()
    @IsNotEmpty()
    projectName: string;

    @IsString()
    @IsNotEmpty()
    teamName: string;
}

export class projectAccessDto {
    @IsArray()
    AddAccess: string[];

    @IsArray()
    RemoveAccess: string[];
}
