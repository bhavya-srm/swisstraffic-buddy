import { MapPin, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Station } from '@/types/transport';
import { useFavoritesStore } from '@/stores/favoritesStore';

interface StationCardProps {
  station: Station;
  onClick: () => void;
  className?: string;
}

export const StationCard = ({ station, onClick, className }: StationCardProps) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isStationFavorite = isFavorite(station.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(station);
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-station bg-gradient-card border-border/50",
        "hover:scale-[1.02] active:scale-[0.98]",
        isStationFavorite && "ring-2 ring-primary/20 bg-gradient-primary/5",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <MapPin className={cn(
                "h-5 w-5 transition-colors",
                isStationFavorite ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {station.name}
              </h3>
              {station.distance && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistance(station.distance)} away</span>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-transparent"
            onClick={handleFavoriteClick}
          >
            <Heart className={cn(
              "h-4 w-4 transition-colors",
              isStationFavorite 
                ? "fill-primary text-primary" 
                : "text-muted-foreground hover:text-primary"
            )} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};