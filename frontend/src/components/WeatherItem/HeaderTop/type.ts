export interface ApiResponse {
  city: string;
}
export interface SearchResponse {
  city: string[];
}
export type HeaderTopProps = {
  onCitySelect: (lat: number, lng: number, cityName: string) => void;
  cityTab: string;
  setCityTab: (tab: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
};

export {};
