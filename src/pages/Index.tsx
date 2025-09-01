import { useState, useEffect } from 'react';
import { MapPin, Search, Menu, AlertCircle, Star, Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StationCard } from '@/components/StationCard';
import { DeparturesList } from '@/components/DeparturesList';
import { SearchSidebar } from '@/components/SearchSidebar';
import { SettingsSidebar } from '@/components/SettingsSidebar';
import { LocationService } from '@/services/locationService';
import { TransportAPI } from '@/services/transportAPI';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import type { Station } from '@/types/transport';

const Index = () => {
  const [nearbyStations, setNearbyStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const { favoriteStations, isFavorite } = useFavoritesStore();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Fetch nearby stations based on user location
  const fetchNearbyStations = async () => {
    setLoading(true);
    setLocationError(null);

    try {
      const location = await LocationService.getCurrentPosition();
      
      if (!location) {
        setLocationError('Unable to get your location. Please enable location services.');
        return;
      }

      const stations = await TransportAPI.fetchNearbyStations(
        location.latitude,
        location.longitude,
        1000 // 1km radius
      );

      setNearbyStations(stations);
      
      if (stations.length === 0) {
        toast({
          title: t('no.stations.found'),
          description: t('no.stations.description'),
        });
      }
    } catch (error) {
      console.error('Error fetching nearby stations:', error);
      setLocationError('Failed to fetch nearby stations. Please try again.');
      toast({
        title: "Error",
        description: "Failed to fetch nearby stations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh
  const { containerRef, isRefreshing, pullDistance, isPulling } = usePullToRefresh({
    onRefresh: fetchNearbyStations,
    isEnabled: !selectedStation,
  });

  useEffect(() => {
    fetchNearbyStations();
  }, []);

  // Combine and sort stations: favorites first, then nearby by distance
  const allStations = (() => {
    const favoriteStationIds = new Set(favoriteStations.map(s => s.id));
    const nonFavoriteNearby = nearbyStations.filter(s => !favoriteStationIds.has(s.id));
    
    return [
      ...favoriteStations.map(s => ({ ...s, isFavorite: true })),
      ...nonFavoriteNearby
    ];
  })();

  const handleStationSelect = (station: Station | string) => {
    if (typeof station === 'string') {
      // Handle station name string - search for the station
      TransportAPI.searchStations(station).then(stations => {
        if (stations.length > 0) {
          setSelectedStation(stations[0]);
        }
      }).catch(error => {
        console.error('Error finding station:', error);
        toast({
          title: "Error",
          description: "Failed to find station. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      setSelectedStation(station);
    }
  };

  const handleBackToList = () => {
    setSelectedStation(null);
  };

  if (selectedStation) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <DeparturesList
            station={selectedStation}
            onBack={handleBackToList}
            onStationSelect={handleStationSelect}
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-background overflow-y-auto"
      style={{
        paddingTop: isPulling ? `${pullDistance}px` : '0px',
        transition: isPulling ? 'none' : 'padding-top 0.3s ease',
      }}
    >
      {/* Pull to refresh indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-background/90 backdrop-blur-sm z-10"
          style={{
            transform: `translateY(${Math.max(-60, -60 + pullDistance)}px)`,
          }}
        >
          <div className="flex items-center space-x-2 text-muted-foreground">
            <RotateCcw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Pull to refresh'}</span>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto p-4 pt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('app.title')}</h1>
            <p className="text-muted-foreground">{t('app.subtitle')}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>{t('search')}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-5 w-5 animate-pulse" />
              <span>{t('finding.stations')}</span>
            </div>
          </div>
        ) : locationError ? (
          /* Location Error */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('location.required')}
            </h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              {locationError}
            </p>
            <Button onClick={fetchNearbyStations}>
              {t('try.again')}
            </Button>
          </div>
        ) : (
          /* Stations List */
          <div className="space-y-4">
            {/* Favorites Section */}
            {favoriteStations.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('favorite.stations')}
                  </h2>
                </div>
                <div className="space-y-3">
                  {favoriteStations.map((station) => (
                    <StationCard
                      key={`favorite-${station.id}`}
                      station={station}
                      onClick={() => handleStationSelect(station)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Stations Section */}
            {nearbyStations.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('nearby.stations')}
                  </h2>
                </div>
                <div className="space-y-3">
                  {nearbyStations
                    .filter(station => !isFavorite(station.id))
                    .map((station) => (
                      <StationCard
                        key={`nearby-${station.id}`}
                        station={station}
                        onClick={() => handleStationSelect(station)}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {allStations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t('no.stations.found')}
                </h3>
                <p className="text-muted-foreground max-w-sm mb-4">
                  {t('no.stations.description')}
                </p>
                <Button onClick={() => setShowSearch(true)}>
                  {t('search.stations')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Sidebar */}
      <SearchSidebar
        open={showSearch}
        onOpenChange={setShowSearch}
        onStationSelect={handleStationSelect}
      />

      {/* Settings Sidebar */}
      <SettingsSidebar
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </div>
  );
};

export default Index;
