import { Settings, Moon, Sun, Languages } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { useState } from 'react';

interface SettingsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsSidebar = ({ open, onOpenChange }: SettingsSidebarProps) => {
  const { theme, setTheme } = useTheme();
  const [isGerman, setIsGerman] = useState(false);

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setIsGerman(!isGerman);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>{isGerman ? 'Einstellungen' : 'Settings'}</span>
          </SheetTitle>
          <SheetDescription>
            {isGerman ? 'Passen Sie Ihre App-Einstellungen an' : 'Customize your app preferences'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Dark Mode Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor="dark-mode" className="text-sm font-medium">
                  {isGerman ? 'Dunkler Modus' : 'Dark Mode'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isGerman 
                    ? 'Wechseln Sie zu einem dunkleren Design' 
                    : 'Switch to a darker theme'
                  }
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={toggleDarkMode}
            />
          </div>

          {/* Language Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="language" className="text-sm font-medium">
                  {isGerman ? 'Sprache' : 'Language'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isGerman 
                    ? 'Zwischen Englisch und Deutsch wechseln' 
                    : 'Switch between English and German'
                  }
                </p>
              </div>
            </div>
            <Switch
              id="language"
              checked={isGerman}
              onCheckedChange={toggleLanguage}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};