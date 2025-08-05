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

  const getZurichTransportColor = (category: string, number: string): string => {
    const cat = category.toLowerCase();
    const lineNumber = parseInt(number);
    
    // Zurich tram colors - exact RGB codes from specification
    if (cat.includes('tram') || cat.includes('t')) {
      switch (lineNumber) {
        case 2: case 15: case 304: case 743: return 'bg-[rgb(226,10,22)] text-white';
        case 3: case 11: case 202: case 760: return 'bg-[rgb(0,137,37)] text-white';
        case 4: case 9: case 303: case 751: return 'bg-[rgb(17,41,111)] text-white';
        case 5: case 305: return 'bg-[rgb(115,69,34)] text-white';
        case 6: case 307: return 'bg-[rgb(202,125,60)] text-white';
        case 7: return 'bg-[rgb(0,0,0)] text-white';
        case 8: case 301: case 752: return 'bg-[rgb(138,181,31)] text-white';
        case 10: case 308: case 748: return 'bg-[rgb(225,36,114)] text-white';
        case 12: return 'bg-[rgb(94,179,219)] text-white';
        case 13: case 306: return 'bg-[rgb(255,193,0)] text-black';
        case 14: case 309: return 'bg-[rgb(0,141,197)] text-white';
        case 16: return 'bg-[rgb(16,55,82)] text-white';
        case 17: return 'bg-[rgb(142,34,77)] text-white';
        default: return 'bg-transport-tram text-white';
      }
    }
    
    // Zurich bus colors - exact RGB codes from specification
    if (cat.includes('bus') || cat.includes('b')) {
      switch (lineNumber) {
        case 31: return 'bg-[rgb(165,162,198)] text-black';
        case 32: return 'bg-[rgb(204,178,209)] text-black';
        case 33: return 'bg-[rgb(218,214,156)] text-black';
        case 46: return 'bg-[rgb(193,213,159)] text-black';
        case 62: return 'bg-[rgb(202,192,182)] text-black';
        case 72: return 'bg-[rgb(198,166,147)] text-black';
        case 80: return 'bg-[rgb(203,207,179)] text-black';
        case 94: return 'bg-[rgb(169,163,155)] text-black';
        default: return 'bg-[rgb(255,255,255)] text-black';
      }
    }
    
    // Trains and other transport
    if (cat.includes('train') || cat.includes('ic') || cat.includes('ir') || cat.includes('re') || cat.includes('s')) {
      return 'bg-transport-train text-white';
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
    setLoading(true);
    // Use the passList from the departure data
    const routeStops = departure.passList || [];
    setStops(routeStops);
    setLoading(false);
  }, [departure]);

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
          className={getZurichTransportColor(departure.category, departure.number)}
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
      ) : stops.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">
            No route information available for this departure.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {stops.map((stop, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      index === 0 ? 'bg-primary' : 'bg-muted-foreground'
                    }`}></div>
                    <div>
                      <p className="font-medium text-foreground">{stop.name}</p>
                      {stop.platform && (
                        <p className="text-sm text-muted-foreground">
                          Platform {stop.platform}
                        </p>
                      )}
                      {stop.delay && stop.delay > 0 && (
                        <p className="text-sm text-destructive">
                          +{stop.delay}min delay
                        </p>
                      )}
                    </div>
                  </div>
                  {(() => {
                    const departureTime = stop.departure ? getMinutesFromNow(stop.departure) : null;
                    const arrivalTime = stop.arrival ? getMinutesFromNow(stop.arrival) : null;
                    const time = departureTime !== null ? departureTime : arrivalTime;
                    
                    if (time === null || time === 0) return null;
                    
                    return (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {`${time}min`}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};