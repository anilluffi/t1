import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteCity } from './favorite-city.entity';
import { User } from '../users/user.entity';
import * as path from 'path';
import { readFileSync } from 'fs';
@Injectable()
export class FavoriteCitiesService {
  private citiesData;
  constructor(
    @InjectRepository(FavoriteCity)
    private favoriteCityRepository: Repository<FavoriteCity>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    const filePath = path.join(process.cwd(), 'src', 'ua-cities.json');

    this.citiesData = JSON.parse(readFileSync(filePath, 'utf8'));
  }

  async addFavoriteCity(userId: number, city: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const newCity = this.favoriteCityRepository.create({
      user,
      city_name: city,
    });

    return this.favoriteCityRepository.save(newCity);
  }

  searchCity(cityName: string) {
    cityName = cityName.toLowerCase();

    for (const country of this.citiesData) {
      for (const region of country.regions) {
        const city = region.cities.find(
          (c) => c.name.toLowerCase() === cityName,
        );
        if (city) {
          return {
            country: country.name,
            region: region.name,
            ...city,
          };
        }
      }
    }

    return { error: 'City not found' };
  }
}
