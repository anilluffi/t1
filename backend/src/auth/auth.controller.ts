import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  Req,
  UseGuards,
  Param,
  Get,
  Res,
  Query,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('api/auth')
export class AuthController {
  [x: string]: any;
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  async refreshToken(@Body() body) {
    const { refreshToken } = body;
    //console.log("con refreshToken:", refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      console.error('JWT_REFRESH_SECRET не найден в .env');
      throw new InternalServerErrorException('Server misconfiguration');
    }

    //console.log('con JWT_REFRESH_SECRET:', refreshSecret);

    try {
      if (!this.jwtService || typeof this.jwtService.verify !== 'function') {
        console.error('jwtService не инициализирован');
        throw new InternalServerErrorException('JWT service is unavailable');
      }

      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      });

      //console.log("decod payload:", payload);

      const userId = payload?.sub;
      if (!userId) {
        throw new UnauthorizedException('User ID not found');
      }

      const newTokens = await this.authService.refreshToken(refreshToken);
      return newTokens;
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error.message);

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      throw new UnauthorizedException('Failed to refresh token');
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const userId = req.user.sub;

    return this.authService.getProfile(userId);
  }
  @Post('set-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async setAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.sub;
    if (!file) throw new BadRequestException('Файл не был загружен');

    return this.authService.setAvatar(userId, file);
  }

  @Get('avatar/:userId')
  async getAvatar(@Param('userId') userId: number, @Res() res: Response) {
    const avatarPath = path.join(
      __dirname,
      '..',
      'uploads',
      `avatar_${userId}.jpg`,
    );

    if (fs.existsSync(avatarPath)) {
      return res.sendFile(avatarPath);
    }

    throw new NotFoundException('Аватар не найден');
  }

  @Post('favorite-city')
  @UseGuards(JwtAuthGuard)
  async addFavoriteCity(@Req() req, @Body() body: { city: string }) {
    console.log('userId ', req.user.sub);
    const userId = req.user.sub;

    return this.authService.addFavoriteCity(userId, body.city);
  }

  @Post('logout')
  async logoutUser(@Body() { userId }: { userId: number }) {
    return await this.authService.logout(userId);
  }

  @Post('reset-password/mail')
  async resetPasswordMail(@Body() resetDto: ResetPasswordDto) {
    //console.log('Password reset request:', resetDto);//log
    return this.authService.resetPasswordMail(resetDto);
  }

  @Post('confirm')
  async resetPasswordWithToken(
    @Query('token') token: string,
    @Body(ValidationPipe) dto: ChangePasswordDto,
  ) {
    return this.authService.resetPasswordWithToken(token, dto.password);
  }

  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto) {
    //console.log('Received register request:', registerDto);//log
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      console.error('Registration error:', error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
