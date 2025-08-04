import { Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Departure, TransportType } from '@/types/transport';

interface DepartureCardProps {
  departure: Departure;
  className?: string;
}

export const DepartureCard = ({ departure, className }: DepartureCardProps) => {
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-CH', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return isoString;
    }
  };

  const getTransportColor = (category: string): string => {
    const cat = category.toLowerCase();
    if (cat.includes('train') || cat.includes('ic') || cat.includes('ir') || cat.includes('re') || cat.includes('s')) {
      return 'bg-transport-train text-white';
    }
    if (cat.includes('bus') || cat.includes('b')) {
      return 'bg-transport-bus text-white';
    }
    if (cat.includes('tram') || cat.includes('t')) {
      return 'bg-transport-tram text-white';
    }
    return 'bg-secondary text-secondary-foreground';
  };

  const hasDelay = departure.stop.delay && departure.stop.delay > 0;

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-departure border-border/50",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Badge 
              className={cn(
                "flex-shrink-0 font-medium",
                getTransportColor(departure.category)
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
                {formatTime(departure.stop.departure)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};