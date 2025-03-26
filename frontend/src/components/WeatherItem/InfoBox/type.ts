export interface ApiResponse {
  city: string;
  tempNow: string;
}

export interface InfoBoxProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  coords: { lat: number; lng: number };
}

export {};
