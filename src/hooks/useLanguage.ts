import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageStore {
  isGerman: boolean;
  setIsGerman: (isGerman: boolean) => void;
  t: (key: string) => string;
}

const translations = {
  // Header
  'app.title': { en: 'NextUp', de: 'NextUp' },
  'app.subtitle': { en: 'Ready to go?', de: 'Bereit zu gehen?' },
  'search': { en: 'Search', de: 'Suchen' },
  'settings': { en: 'Settings', de: 'Einstellungen' },
  
  // Stations
  'finding.stations': { en: 'Finding nearby stations...', de: 'Suche nahegelegene Stationen...' },
  'location.required': { en: 'Location Access Required', de: 'Standortzugriff erforderlich' },
  'try.again': { en: 'Try Again', de: 'Erneut versuchen' },
  'favorite.stations': { en: 'Favorite Stations', de: 'Lieblingsstationen' },
  'nearby.stations': { en: 'Nearby Stations', de: 'Nahegelegene Stationen' },
  'no.stations.found': { en: 'No stations found', de: 'Keine Stationen gefunden' },
  'no.stations.description': { en: 'No transport stations found within 1km of your location. Try searching for a specific station.', de: 'Keine Verkehrsstationen im Umkreis von 1 km gefunden. Versuchen Sie, nach einer bestimmten Station zu suchen.' },
  'search.stations': { en: 'Search Stations', de: 'Stationen suchen' },
  
  // Departures
  'departures.for': { en: 'Departures for', de: 'Abfahrten für' },
  'platform': { en: 'Platform', de: 'Gleis' },
  'loading.departures': { en: 'Loading departures...', de: 'Lade Abfahrten...' },
  'no.departures': { en: 'No departures found', de: 'Keine Abfahrten gefunden' },
  'no.departures.description': { en: 'No upcoming departures available at this time.', de: 'Derzeit sind keine bevorstehenden Abfahrten verfügbar.' },
  'back': { en: 'Back', de: 'Zurück' },
  'now': { en: 'Now', de: 'Jetzt' },
  
  // Route stops
  'route.stops.timing': { en: 'Route stops and timing', de: 'Routenstopps und Zeiten' },
  'loading.route': { en: 'Loading route information...', de: 'Lade Routeninformationen...' },
  'no.route.info': { en: 'No route information available for this departure.', de: 'Keine Routeninformationen für diese Abfahrt verfügbar.' },
  'delay': { en: 'delay', de: 'Verspätung' },
  
  // Search
  'search.stations.title': { en: 'Search Stations', de: 'Stationen suchen' },
  'search.placeholder': { en: 'Search for a station...', de: 'Nach einer Station suchen...' },
  'searching': { en: 'Searching...', de: 'Suche...' },
  'search.failed': { en: 'Search failed', de: 'Suche fehlgeschlagen' },
  'search.failed.description': { en: 'Unable to search stations. Please try again.', de: 'Stationen können nicht gesucht werden. Bitte versuchen Sie es erneut.' },
  'search.no.results': { en: 'No stations found', de: 'Keine Stationen gefunden' },
  'search.try.different': { en: 'Try searching with a different term', de: 'Versuchen Sie es mit einem anderen Suchbegriff' },
  
  // Settings
  'settings.title': { en: 'Settings', de: 'Einstellungen' },
  'settings.description': { en: 'Customize your app preferences', de: 'Passen Sie Ihre App-Einstellungen an' },
  'dark.mode': { en: 'Dark Mode', de: 'Dunkler Modus' },
  'dark.mode.description': { en: 'Switch to a darker theme', de: 'Zu einem dunkleren Design wechseln' },
  'language': { en: 'Language', de: 'Sprache' },
  'language.description': { en: 'Switch between English and German', de: 'Zwischen Englisch und Deutsch wechseln' },
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      isGerman: false,
      setIsGerman: (isGerman: boolean) => set({ isGerman }),
      t: (key: string) => {
        const { isGerman } = get();
        const translation = translations[key as keyof typeof translations];
        if (!translation) return key;
        return isGerman ? translation.de : translation.en;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);