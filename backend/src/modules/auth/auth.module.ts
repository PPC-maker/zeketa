import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'zeketa_jwt_super_secret_key_2024',
      signOptions: {
        expiresIn: 604800, // 7 days in seconds
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService, LogsService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
