import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [JwtModule.register({}), ConfigModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
