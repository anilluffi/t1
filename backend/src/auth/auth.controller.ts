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

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /////////////////////////////////////////////////////////
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req) {
    //log
    //console.log("Вход в refreshToken контроллер");
    //console.log("req.user:", req.user);
    //console.log("req.body:", req.body);

    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const userId = req.user?.sub;  //
    //console.log("Извлечён userId:", userId);//log

    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }

    try {
      const newTokens = await this.authService.refreshToken(userId, refreshToken);
      return newTokens;
    } catch (error) {
      console.error('error:', error);
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
