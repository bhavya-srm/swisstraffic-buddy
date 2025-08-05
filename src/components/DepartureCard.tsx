import { Clock, AlertCircle, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Departure, TransportType } from '@/types/transport';

interface DepartureCardProps {
  departure: Departure;
  className?: string;
  onClick?: () => void;
}

export const DepartureCard = ({ departure, className, onClick }: DepartureCardProps) => {
  const getMinutesUntilDeparture = (isoString: string): number => {
    try {
      const departureTime = new Date(isoString);
      const now = new Date();
      const diffMs = departureTime.getTime() - now.getTime();
      return Math.max(0, Math.round(diffMs / (1000 * 60)));
    } catch {
      return 0;
    }
  };

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

  const hasDelay = departure.stop.delay && departure.stop.delay > 0;
  const minutesRemaining = getMinutesUntilDeparture(departure.stop.departure);

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-departure border-border/50",
        onClick && "cursor-pointer hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Badge 
              className={cn(
                "flex-shrink-0 font-medium",
                getZurichTransportColor(departure.category, departure.number)
              )}
            >
              {departure.category} {departure.number}
            </Badge>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                → {departure.to}
              </p>
              {departure.stop.platform && (
                <p className="text-sm text-muted-foreground">
                  Platform {departure.stop.platform}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {hasDelay && (
              <div className="flex items-center space-x-1 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  +{departure.stop.delay}min
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">
                {minutesRemaining === 0 ? 'Now' : `${minutesRemaining}min`}
              </span>
            </div>

            {onClick && (
              <MapPin className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
