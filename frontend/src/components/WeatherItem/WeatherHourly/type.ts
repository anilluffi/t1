export interface WeatherData {
  city: string;
  hourly: {
    time: string;
    temp: number;
    wind: number;
    windDirection: string;
    precipitation: number;
    icon: string;
  }[];
}
export type WeatherHourlyProps = {
  coords: { lat: number; lng: number };
};

export {};
