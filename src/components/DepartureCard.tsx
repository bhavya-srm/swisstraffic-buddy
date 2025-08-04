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

  const getZurichTramColor = (category: string, number: string): string => {
    const cat = category.toLowerCase();
    
    // Zurich tram colors based on line numbers
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
    
    // Keep existing colors for other transport types
    if (cat.includes('train') || cat.includes('ic') || cat.includes('ir') || cat.includes('re') || cat.includes('s')) {
      return 'bg-transport-train text-white';
    }
    if (cat.includes('bus') || cat.includes('b')) {
      return 'bg-transport-bus text-white';
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
                getZurichTramColor(departure.category, departure.number)
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
