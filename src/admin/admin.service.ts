import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { VerifyUserDto } from "./dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private config: ConfigService) {}
    async  VerifyUser(dto: VerifyUserDto) {
        const roleRes = await this.prisma.CheckUserRole(dto.email, "verified")

        if(roleRes) {
            throw new HttpException("User Already Verified", HttpStatus.BAD_REQUEST)
        };
       const verifyRes = await this.prisma.VerifyUser(dto.email)

       if(!verifyRes) {throw new HttpException("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR)};
       return {message: "User Verified Successfully",  data:verifyRes }
    }
}
