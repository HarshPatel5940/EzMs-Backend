import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class userEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    name?: string;
}
