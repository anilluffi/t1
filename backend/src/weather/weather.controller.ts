import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('now')
  async getWeatherNow(@Query('lat') lat: string, @Query('lon') lon: string) {
    try {
      return await this.weatherService.getWeatherNow(lat, lon);
    } catch (error) {
      console.error('Weather now request failed:', error);
      return { error: 'Failed to fetch current weather' };
    }
  }

  @Get('hourly')
  async getWeatherHourly(@Query('lat') lat: string, @Query('lon') lon: string) {
    try {
      return await this.weatherService.getWeatherHourly(lat, lon);
    } catch (error) {
      console.error('Hourly weather request failed:', error);
      return { error: 'Failed to fetch hourly weather' };
    }
  }

  @Get('week')
  @UseGuards(JwtAuthGuard)
  async getWeatherWeek(@Query('lat') lat: string, @Query('lon') lon: string) {
    try {
      return await this.weatherService.getWeatherWeek(lat, lon);
    } catch (error) {
      console.error('Week weather request failed:', error);
      return { error: 'Failed to fetch weekly weather' };
    }
  }
}
