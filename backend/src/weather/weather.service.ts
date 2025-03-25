import { Injectable } from '@nestjs/common';
import axios from 'axios';

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
interface CityResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
@Injectable()
export class WeatherService {
  private citiesData;
  private async fetchWeatherData(
    lat: string,
    lon: string,
  ): Promise<ForecastResponse> {
    const apiKey = process.env.WEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const { data }: { data: ForecastResponse } = await axios.get(weatherUrl);
    return data;
  }

  async getWeatherNow(lat: string, lon: string) {
    const data = await this.fetchWeatherData(lat, lon);
    const current = data.list[0];
    //console.log('LOG   ', { data });
    return {
      city: data.city.name,
      weatherNow: current.weather[0].description,
      tempNow: `${Math.round(current.main.temp)}°C`,
      windNow: `${Math.round(current.wind.speed)} m/s`,
      pressureNow: `${current.main.pressure} hPa`,
      humidityNow: `${current.main.humidity}%`,
      icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
    };
  }

  async getWeatherHourly(lat: string, lon: string) {
    const data = await this.fetchWeatherData(lat, lon);

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

    return { city: data.city.name, hourly: hourlyForecast };
  }

  async getWeatherWeek(lat: string, lon: string) {
    const data = await this.fetchWeatherData(lat, lon);

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

    return { city: data.city.name, weekForecast };
  }

  async searchCity(cityName: string, countryCode = '', stateCode = '') {
    const apiKey = process.env.WEATHER_API_KEY;
    const limit = 5;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`;

    try {
      const { data } = await axios.get<CityResponse[]>(url);
      // console.log('data.length:', data.length);

      if (data.length === 0) {
        return { error: 'City not found' };
      }

      const citiesList = data.map((city) => ({
        name: city.name,
        lat: city.lat,
        lon: city.lon,
        country: city.country,
        state: city.state || '',
      }));

      return citiesList;
    } catch (error) {
      console.error('Error fetching city data:', error.message);
      return { error: 'Failed to fetch city data' };
    }
  }
}
