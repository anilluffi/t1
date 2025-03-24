import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteCitiesService } from './favorite-city.service';
import { FavoriteCity } from './favorite-city.entity';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteCity, User]), UsersModule],
  providers: [FavoriteCitiesService],
  exports: [FavoriteCitiesService],
})
export class FavoriteCityModule {}
