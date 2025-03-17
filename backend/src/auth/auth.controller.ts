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
import { userInfo } from 'os';
import axios from 'axios';

interface WeatherResponse {
  main: { temp: number };
  weather: { description: string }[];
  name: string;
}
interface ForecastResponse {
  list: {
    main: { temp: number };
    weather: { description: string }[];
    dt_txt: string;
  }[];
}



@Controller('api/auth')
export class AuthController {
  [x: string]: any;
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }


  
  // @Get(':userId')
  // async getFavoriteCities(@Param('userId') userId: number) {
  //   return this.favoriteCitiesService.getFavoriteCities(userId);
  // }


  @Post('login')
  async loginUser(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /////////////////////////////////////////////////////////
  
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

    const payload = this.jwtService.verify(refreshToken, { secret: refreshSecret });

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



  /////////////////////////////////////////////////////////

  @Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Req() req) {
    const userId = req.user.sub;
    
    return this.authService.getProfile(userId);
}

@Post('set-avarar')
@UseGuards(JwtAuthGuard)
async setAvatar(@Req() req){
  const userId = req.user.sub;
  console.log("set Avatar start in back");
  return this.authService.setAvatar(userId);
}



@Post('favorite-city')
@UseGuards(JwtAuthGuard)
  async addFavoriteCity(@Req() req, @Body() body: {city: string }) {
    console.log("userId ", req.user.sub);
    const userId = req.user.sub;
    
    return this.authService.addFavoriteCity(userId, body.city);
  }

@Get("weather")
async getWeather(@Query("lat") lat: string, @Query("lon") lon: string) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const { data: weatherData } = await axios.get<WeatherResponse>(weatherUrl);
    const { data: forecastData } = await axios.get<ForecastResponse>(forecastUrl);

    const weekForecast: { date: string; temp: string; description: string }[] = [];
    const addedDates = new Set();

    const today = new Date().toISOString().split("T")[0]; 

    for (const item of forecastData.list) {
      const date = item.dt_txt.split(" ")[0];

      if (date !== today && !addedDates.has(date)) {
        weekForecast.push({
          date: new Date(item.dt_txt).toLocaleDateString("ru-RU", {
            weekday: "short",
            day: "numeric",
            month: "numeric",
          }),
          temp: `${Math.round(item.main.temp)}`,
          description: item.weather[0].description,
        });

        addedDates.add(date);

        if (weekForecast.length === 6) break;
      }
    }

    return {
      city: weatherData.name,
      weatherNow: `${Math.round(weatherData.main.temp)}°C, ${weatherData.weather[0].description}`,
      weatherAfter3h: `${Math.round(forecastData.list[1].main.temp)}°C, ${forecastData.list[1].weather[0].description}`,
      weatherAfter6h: `${Math.round(forecastData.list[2].main.temp)}°C, ${forecastData.list[2].weather[0].description}`,
      weekForecast,
    };
  } catch (error) {
    console.error("Ошибка запроса погоды:", error);
    return { weatherNow: "Не удалось получить погоду" };
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
