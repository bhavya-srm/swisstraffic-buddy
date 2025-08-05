import { useState, useEffect, useCallback } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { StationCard } from './StationCard';
import { TransportAPI } from '@/services/transportAPI';
import { useToast } from '@/hooks/use-toast';
import type { Station } from '@/types/transport';

interface SearchSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStationSelect: (station: Station) => void;
}

export const SearchSidebar = ({ open, onOpenChange, onStationSelect }: SearchSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  const searchStations = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await TransportAPI.searchStations(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Unable to search stations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  }, [toast]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchStations(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchStations]);

  const handleStationSelect = (station: Station) => {
    onStationSelect(station);
    onOpenChange(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Stations</span>
            </SheetTitle>
          </SheetHeader>

          <div className="p-6 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 focus:ring-accent focus:border-accent"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {searching ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Search className="h-5 w-5 animate-pulse" />
                  <span>Searching...</span>
                </div>
              </div>
            ) : searchQuery && searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground mb-2">
                  No stations found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try searching with a different term
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    onClick={() => handleStationSelect(station)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};