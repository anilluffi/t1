import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoriteCitiesService } from './favorite-city.service';

@Controller('api/city')
export class FavoriteCities {
  constructor(private readonly cityService: FavoriteCitiesService) {}

  @Post('favorite-city')
  @UseGuards(JwtAuthGuard)
  async addFavoriteCity(@Req() req, @Body() body: { city: string }) {
    console.log('userId ', req.user.sub);
    const userId = req.user.sub;

    return this.cityService.addFavoriteCity(userId, body.city);
  }

  @Get('search')
  async searchCity(@Query('name') cityName: string) {
    console.log('Searching for city:', cityName); // log
    return this.cityService.searchCity(cityName);
  }
}
