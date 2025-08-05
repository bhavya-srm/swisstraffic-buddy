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
