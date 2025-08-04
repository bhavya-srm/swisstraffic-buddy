
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransportAPI } from '@/services/transportAPI';
import { useToast } from '@/hooks/use-toast';
import type { Departure, RouteStop } from '@/types/transport';

interface RouteStopsViewProps {
  departure: Departure;
  onBack: () => void;
}

export const RouteStopsView = ({ departure, onBack }: RouteStopsViewProps) => {
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getZurichTramColor = (category: string, number: string): string => {
    const cat = category.toLowerCase();
    
    if (cat.includes('tram') || cat.includes('t')) {
      const lineNumber = parseInt(number);
      switch (lineNumber) {
        case 2: return 'bg-red-600 text-white';
        case 3: return 'bg-green-700 text-white';
        case 4: return 'bg-blue-900 text-white';
        case 5: return 'bg-amber-800 text-white';
        case 6: return 'bg-orange-600 text-white';
        case 7: return 'bg-black text-white';
        case 8: return 'bg-green-500 text-white';
        case 9: return 'bg-indigo-600 text-white';
        case 10: return 'bg-pink-500 text-white';
        case 11: return 'bg-green-600 text-white';
        case 13: return 'bg-yellow-400 text-black';
        case 14: return 'bg-sky-400 text-white';
        case 15: return 'bg-red-600 text-white';
        case 17: return 'bg-fuchsia-600 text-white';
        default: return 'bg-transport-tram text-white';
      }
    }
    
    if (cat.includes('train') || cat.includes('ic') || cat.includes('ir') || cat.includes('re') || cat.includes('s')) {
      return 'bg-transport-train text-white';
    }
    if (cat.includes('bus') || cat.includes('b')) {
      return 'bg-transport-bus text-white';
    }
    
    return 'bg-secondary text-secondary-foreground';
  };

  const getMinutesFromNow = (isoString: string): number => {
    try {
      const time = new Date(isoString);
      const now = new Date();
      const diffMs = time.getTime() - now.getTime();
      return Math.max(0, Math.round(diffMs / (1000 * 60)));
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const fetchRouteStops = async () => {
      setLoading(true);
      try {
        // For now, create a mock implementation since the API might not have detailed route info
        // In a real implementation, you'd call something like:
        // const routeStops = await TransportAPI.fetchRouteStops(departure.category, departure.number, departure.stop.departure);
        
        // Mock data for demonstration - in production, replace with actual API call
        const mockStops: RouteStop[] = [
          {
            name: "Current Station",
            departure: departure.stop.departure,
            arrival: departure.stop.departure,
            platform: departure.stop.platform
          },
          // Add more mock stops here based on common Zurich routes
        ];
        
        setStops(mockStops);
      } catch (error) {
        console.error('Error fetching route stops:', error);
        toast({
          title: "Error",
          description: "Failed to fetch route information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRouteStops();
  }, [departure, toast]);

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
      </div>

      {/* Route Info */}
      <div className="flex items-center space-x-3 mb-4">
        <Badge 
          className={getZurichTramColor(departure.category, departure.number)}
        >
          {departure.category} {departure.number}
        </Badge>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            → {departure.to}
          </h1>
          <p className="text-muted-foreground text-sm">
            Route stops and timing
          </p>
        </div>
      </div>

      {/* Route Stops */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-5 w-5 animate-spin" />
            <span>Loading route information...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-foreground">Current Station</p>
                    {departure.stop.platform && (
                      <p className="text-sm text-muted-foreground">
                        Platform {departure.stop.platform}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {getMinutesFromNow(departure.stop.departure) === 0 ? 'Now' : `${getMinutesFromNow(departure.stop.departure)}min`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Note about route information */}
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              Route stop information is coming soon!
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              This feature will show all upcoming stops with precise timing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
