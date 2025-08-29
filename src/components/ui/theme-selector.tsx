"use client"

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Check, Palette, ChevronDown } from 'lucide-react';
import { getAllThemes, getTheme } from '@/config/themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ThemeSelectorProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'compact';
}

export function ThemeSelector({ 
  className = '', 
  showLabel = true, 
  variant = 'default' 
}: ThemeSelectorProps) {
  const { theme, setTheme, themes: availableThemes } = useTheme();
  const [mounted, setMounted] = useState(false);
  const allThemes = getAllThemes();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme ? getTheme(theme) : allThemes[0];

  const ThemePreview = ({ themeName }: { themeName: string }) => {
    const themeConfig = getTheme(themeName);
    
    return (
      <div className="flex items-center gap-3 w-full">
        <div className="flex gap-1">
          <div 
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: themeConfig.primary }}
          />
          <div 
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: themeConfig.secondary }}
          />
          <div 
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: themeConfig.preview.card }}
          />
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-medium text-sm">{themeConfig.label}</span>
          {variant !== 'compact' && (
            <span className="text-xs text-muted-foreground">
              {themeConfig.description}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && variant !== 'compact' && (
        <span className="text-sm font-medium text-muted-foreground">
          Theme:
        </span>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="justify-between min-w-[200px] h-auto py-2 px-3"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentTheme.label}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-[280px] max-h-[400px] overflow-y-auto"
        >
          <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Choose Theme
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {allThemes.map((themeConfig) => (
            <DropdownMenuItem
              key={themeConfig.name}
              className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setTheme(themeConfig.name)}
            >
              <div className="flex items-center justify-between w-full">
                <ThemePreview themeName={themeConfig.name} />
                {theme === themeConfig.name && (
                  <Check className="w-4 h-4 text-primary ml-2" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Compact version for mobile or tight spaces
export function CompactThemeSelector({ className = '' }: { className?: string }) {
  return (
    <ThemeSelector 
      className={className}
      showLabel={false}
      variant="compact"
    />
  );
}

// Theme preview card component for settings pages
export function ThemePreviewCard({ 
  themeName, 
  isSelected, 
  onSelect 
}: { 
  themeName: string; 
  isSelected: boolean; 
  onSelect: () => void; 
}) {
  const themeConfig = getTheme(themeName);
  
  return (
    <div
      className={`
        relative p-4 border rounded-lg cursor-pointer transition-all duration-200
        hover:shadow-md hover:scale-[1.02]
        ${isSelected 
          ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
          : 'border-border hover:border-primary/50'
        }
      `}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div 
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: themeConfig.primary }}
            />
            <div 
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: themeConfig.secondary }}
            />
            <div 
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: themeConfig.preview.card }}
            />
          </div>
          <h3 className="font-semibold text-sm">{themeConfig.label}</h3>
        </div>
        
        <p className="text-xs text-muted-foreground">
          {themeConfig.description}
        </p>
        
        {/* Mini preview */}
        <div 
          className="h-16 rounded border"
          style={{ 
            backgroundColor: themeConfig.preview.background,
            color: themeConfig.preview.foreground 
          }}
        >
          <div 
            className="h-8 rounded-t"
            style={{ backgroundColor: themeConfig.primary }}
          />
          <div 
            className="h-4 m-1 rounded"
            style={{ backgroundColor: themeConfig.preview.card }}
          />
        </div>
      </div>
    </div>
  );
}