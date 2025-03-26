export interface FavoriteCity {
  id: number;
  city_name: string;
}

export interface ApiResponse {
  id: number;
  email: string;
  username?: string;
  favoriteCities: FavoriteCity[];
}
