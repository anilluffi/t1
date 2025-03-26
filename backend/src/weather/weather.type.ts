export interface WeatherItem {
  dt_txt: string;
  main: { temp: number; humidity: number; pressure: number };
  wind: { speed: number; deg: number };
  weather: { description: string; icon: string }[];
}

export interface ForecastResponse {
  city: { name: string };
  list: WeatherItem[];
}
export interface CityResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherApiResponse {
  city: {
    name: string;
  };
  list: Array<{
    dt_txt: string;
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    weather: Array<{
      icon: string;
    }>;
  }>;
}
export {};
