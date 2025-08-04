import type { Station, StationResponse, Departure, DepartureResponse } from '@/types/transport';

const BASE_URL = 'https://transport.opendata.ch/v1';

export class TransportAPI {
  static async fetchNearbyStations(
    latitude: number, 
    longitude: number, 
    radius: number = 1000
  ): Promise<Station[]> {
    try {
      const url = `${BASE_URL}/locations?x=${longitude}&y=${latitude}&type=station`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StationResponse = await response.json();
      
      // Calculate distances and filter by radius
      const userLocation = { latitude, longitude };
      const nearbyStations = data.stations
        .map(station => ({
          ...station,
          distance: this.calculateDistance(
            userLocation,
            station.coordinate
          )
        }))
        .filter(station => station.distance! <= radius)
        .sort((a, b) => a.distance! - b.distance!);
      
      return nearbyStations;
    } catch (error) {
      console.error('Error fetching nearby stations:', error);
      return [];
    }
  }

  static async fetchDepartures(stationName: string): Promise<Departure[]> {
    try {
      const encodedStation = encodeURIComponent(stationName);
      const url = `${BASE_URL}/stationboard?station=${encodedStation}&limit=20`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DepartureResponse = await response.json();
      
      return data.stationboard.map(departure => ({
        ...departure,
        id: `${departure.stop.departure}-${departure.category}-${departure.number}`
      }));
    } catch (error) {
      console.error('Error fetching departures:', error);
      return [];
    }
  }

  static async searchStations(query: string): Promise<Station[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${BASE_URL}/locations?query=${encodedQuery}&type=station`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StationResponse = await response.json();
      return data.stations || [];
    } catch (error) {
      console.error('Error searching stations:', error);
      return [];
    }
  }

  private static calculateDistance(
    pos1: { latitude: number; longitude: number },
    pos2: { latitude: number; longitude: number }
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (pos1.latitude * Math.PI) / 180;
    const φ2 = (pos2.latitude * Math.PI) / 180;
    const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
    const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}