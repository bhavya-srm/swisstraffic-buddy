
export interface Station {
  id: string;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  isFavorite?: boolean;
}

export interface StationResponse {
  stations: Station[];
}

export interface Departure {
  id: string;
  category: string;
  number: string;
  to: string;
  stop: {
    departure: string;
    platform?: string;
    delay?: number;
  };
  operator?: string;
  passList?: RouteStop[];
}

export interface DepartureResponse {
  stationboard: Departure[];
}

export interface RouteStop {
  name: string;
  arrival?: string;
  departure?: string;
  platform?: string;
  delay?: number;
}

export type TransportType = 'train' | 'bus' | 'tram' | 'ship' | 'cableway';
