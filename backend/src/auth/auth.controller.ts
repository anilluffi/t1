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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
@Controller('api/auth')
export class AuthController {
  [x: string]: any;
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /////////////////////////////////////////////////////////
  
  @Post('refresh')
async refreshToken(@Body() body) {
  const { refreshToken } = body;
  //console.log("Принят refreshToken:", refreshToken);

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

    const payload = this.jwtService.verify(refreshToken, { secret: refreshSecret });

    //console.log("Расшифрован payload:", payload);

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



  /////////////////////////////////////////////////////////


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
