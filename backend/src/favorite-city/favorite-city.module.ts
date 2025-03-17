import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteCitiesService } from './favorite-city.service';
import { FavoriteCity } from './favorite-city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteCity])],
  providers: [FavoriteCitiesService],
  exports: [FavoriteCitiesService],
})
export class FavoriteCityModule {}
