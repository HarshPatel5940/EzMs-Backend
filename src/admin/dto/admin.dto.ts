import { IsEmail, IsNotEmpty } from "class-validator";

export class userEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
