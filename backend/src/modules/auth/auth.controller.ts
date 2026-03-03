import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Ip,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

class LoginDto {
  email: string;
  password: string;
}

class RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.login(dto, ip, userAgent);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.sub,
      dto.oldPassword,
      dto.newPassword,
    );
  }

  @Post('create-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createAdmin(@Request() req: any, @Body() dto: RegisterDto) {
    return this.authService.createAdminUser(dto, req.user.sub);
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Request() req: any) {
    return { valid: true, user: req.user };
  }

  @Post('seed-admin')
  @HttpCode(HttpStatus.OK)
  async seedAdmin(@Body() body: { email: string; password: string; firstName?: string; lastName?: string; secretKey: string }) {
    return this.authService.seedAdmin(
      { email: body.email, password: body.password, firstName: body.firstName, lastName: body.lastName },
      body.secretKey
    );
  }
}
