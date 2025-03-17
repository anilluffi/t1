import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteCity } from './favorite-city.entity';

@Injectable()
export class FavoriteCitiesService {
  constructor(
    @InjectRepository(FavoriteCity)
    private readonly favoriteCityRepository: Repository<FavoriteCity>,
  ) {}


}
