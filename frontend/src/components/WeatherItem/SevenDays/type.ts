export interface ApiResponse {
  city: string;
  weekForecast?: {
    date: string;
    temp: string;
    wind: string;
    description: string;
    humidity: string;
    pressure: string;
    icon: string;
  }[];
}
export type WeatherSevenDaysProps = {
  coords: { lat: number; lng: number };
};

export {};
