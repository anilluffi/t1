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
import { userInfo } from 'os';
import axios from 'axios';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
interface WeatherItem {
  dt_txt: string;
  main: { temp: number; humidity: number; pressure: number };
  wind: { speed: number; deg: number };
  weather: { description: string; icon: string }[];
}

interface ForecastResponse {
  city: { name: string };
  list: WeatherItem[];
}

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

  @Get('weather')
  async getWeather(@Query('lat') lat: string, @Query('lon') lon: string) {
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      const { data }: { data: ForecastResponse } = await axios.get(weatherUrl);

      const current = data.list[0];
      const weatherNow = {
        city: data.city.name,
        weatherNow: current.weather[0].description,
        tempNow: `${Math.round(current.main.temp)}°C`,
        windNow: `${Math.round(current.wind.speed)} m/s`,
        pressureNow: `${current.main.pressure} hPa`,
        humidityNow: `${current.main.humidity}%`,
        icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
      };

      const hourlyForecast = data.list.slice(0, 9).map((item) => ({
        time: item.dt_txt.split(' ')[1].slice(0, 5),
        temp: Math.round(item.main.temp),
        wind: Math.round(item.wind.speed),
        windDirection:
          item.wind.deg > 315 || item.wind.deg <= 45
            ? 'North'
            : item.wind.deg > 45 && item.wind.deg <= 135
              ? 'East'
              : item.wind.deg > 135 && item.wind.deg <= 225
                ? 'South'
                : 'West',
        precipitation: item.main.humidity > 60 ? 'Yes' : 'No',
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      }));

      const weekForecast = data.list
        .filter((item) => item.dt_txt.includes('12:00:00'))
        .map((item) => ({
          date: item.dt_txt.split(' ')[0],
          temp: `${Math.round(item.main.temp)}°C`,
          wind: `${Math.round(item.wind.speed)} m/s`,
          description: item.weather[0].description,
          humidity: `${item.main.humidity}%`,
          pressure: `${item.main.pressure} hPa`,
          icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        }));

      return {
        city: data.city.name,
        weatherNow: current.weather[0].icon,
        tempNow: `${Math.round(current.main.temp)}°C`,
        windNow: `${Math.round(current.wind.speed)} m/s`,
        pressureNow: `${current.main.pressure} hPa`,
        humidityNow: `${current.main.humidity}%`,
        hourly: hourlyForecast,
        icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
        weekForecast,
      };
    } catch (error) {
      console.error('Weather request failed:', error);
      return { error: 'Failed to fetch weather data' };
    }
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
