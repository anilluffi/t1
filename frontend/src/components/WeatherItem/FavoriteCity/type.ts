export interface ApiResponse {
  city: string;
  weatherNow: string;
  weatherAfter3h: string;
  weatherAfter6h: string;
  weekForecast?: {
    date: string;
    temp: string;
    description: string;
  }[];
}
export {};
