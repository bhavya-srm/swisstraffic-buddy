
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
    
    // Zurich tram colors
    if (cat.includes('tram') || cat.includes('t')) {
      switch (lineNumber) {
        case 2: return 'bg-[#E60012] text-white';
        case 3: return 'bg-[#3BBF70] text-white';
        case 4: return 'bg-[#45507B] text-white';
        case 5: return 'bg-[#76247B] text-white';
        case 6: return 'bg-[#D2691E] text-white';
        case 7: return 'bg-[#000000] text-white';
        case 8: return 'bg-[#81C532] text-white';
        case 9: return 'bg-[#6A5ACD] text-white';
        case 10: return 'bg-[#E0643C] text-white';
        case 11: return 'bg-[#3BBF70] text-white';
        case 13: return 'bg-[#FFD700] text-black';
        case 14: return 'bg-[#2D646B] text-white';
        case 15: return 'bg-[#C50000] text-white';
        case 17: return 'bg-[#A05583] text-white';
        default: return 'bg-transport-tram text-white';
      }
    }
    
    // Zurich bus colors
    if (cat.includes('bus') || cat.includes('b')) {
      switch (lineNumber) {
        case 31: return 'bg-[#52855B] text-white';
        case 32: return 'bg-[#52855B] text-white';
        case 33: return 'bg-[#615C15] text-white';
        case 46: return 'bg-[#179915] text-white';
        case 62: return 'bg-[#7528C5] text-white';
        case 72: return 'bg-[#7521C5] text-white';
        case 80: return 'bg-[#52855B] text-white';
        case 94: return 'bg-[#440542] text-white';
        case 311: return 'bg-[#D56049] text-white';
        case 350: return 'bg-[#FFD700] text-black';
        case 88: return 'bg-[#050048] text-white';
        default: return 'bg-transport-bus text-white';
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
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {(() => {
                        const departureTime = stop.departure ? getMinutesFromNow(stop.departure) : null;
                        const arrivalTime = stop.arrival ? getMinutesFromNow(stop.arrival) : null;
                        const time = departureTime !== null ? departureTime : arrivalTime;
                        
                        if (time === null) return '-';
                        return time === 0 ? 'Now' : `${time}min`;
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
