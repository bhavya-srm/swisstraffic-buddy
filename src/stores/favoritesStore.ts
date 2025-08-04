import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Station } from '@/types/transport';

interface FavoritesState {
  favoriteStations: Station[];
  addFavorite: (station: Station) => void;
  removeFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
  toggleFavorite: (station: Station) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteStations: [],
      
      addFavorite: (station) => 
        set((state) => ({
          favoriteStations: [...state.favoriteStations, { ...station, isFavorite: true }]
        })),
      
      removeFavorite: (stationId) =>
        set((state) => ({
          favoriteStations: state.favoriteStations.filter(s => s.id !== stationId)
        })),
      
      isFavorite: (stationId) => 
        get().favoriteStations.some(s => s.id === stationId),
      
      toggleFavorite: (station) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(station.id)) {
          removeFavorite(station.id);
        } else {
          addFavorite(station);
        }
      }
    }),
    {
      name: 'nextup-favorites',
    }
  )
);