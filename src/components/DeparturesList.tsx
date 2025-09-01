
import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DepartureCard } from './DepartureCard';
import { RouteStopsView } from './RouteStopsView';
import { TransportAPI } from '@/services/transportAPI';
import { useToast } from '@/hooks/use-toast';
import type { Station, Departure } from '@/types/transport';

interface DeparturesListProps {
  station: Station;
  onBack: () => void;
}

export const DeparturesList = ({ station, onBack }: DeparturesListProps) => {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchDepartures = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await TransportAPI.fetchDepartures(station.name);
      setDepartures(result);
      
      if (isRefresh) {
        toast({
          title: "Departures updated",
          description: `Found ${result.length} departures`,
        });
      }
    } catch (error) {
      console.error('Error fetching departures:', error);
      toast({
        title: "Error",
        description: "Failed to fetch departures. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDepartures();
  }, [station.name]);

  const handleRefresh = () => {
    fetchDepartures(true);
  };

  const handleDepartureClick = (departure: Departure) => {
    setSelectedDeparture(departure);
  };

  const handleStationClick = (stationName: string) => {
    // Navigate back to search and set the clicked station
    onBack();
    // You could also implement a callback to parent to handle station selection
    console.log('Station clicked:', stationName);
  };
    const handleBackFromRoute = () => {
    setSelectedDeparture(null);
  };

  // Show route stops view if a departure is selected
  if (selectedDeparture) {
    return (
      <RouteStopsView
        departure={selectedDeparture}
        onBack={handleBackFromRoute}
        onStationClick={handleStationClick}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Station Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {station.name}
        </h1>
        <p className="text-muted-foreground">Live departures</p>
      </div>

      {/* Departures */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading departures...</span>
          </div>
        </div>
      ) : departures.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No departures found
          </h3>
          <p className="text-muted-foreground max-w-sm">
            There are currently no scheduled departures from this station.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
            {departures.map((departure, index) => (
              <DepartureCard
                key={`${departure.id}-${index}`}
                departure={departure}
                onClick={() => handleDepartureClick(departure)}
              />
            ))}
        </div>
      )}
    </div>
  );
};
