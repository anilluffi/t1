export type DayDetailContainerProps = {
  coord: {
    lat: number;
    lng: number;
  };
  date: string;
};

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
