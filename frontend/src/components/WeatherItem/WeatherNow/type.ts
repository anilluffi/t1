export interface ApiResponse {
  city: string;
  weatherNow: string;
  tempNow: string;
  windNow: string;
  pressureNow: string;
  humidityNow: string;
  description: string;
  icon: string;
}
export type WeatherNowProps = {
  coords: { lat: number; lng: number };
};

export {};
