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

interface FooterThemeSelectorProps {
  className?: string;
}

export function FooterThemeSelector({ className = '' }: FooterThemeSelectorProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const allThemes = getAllThemes();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-gray-400" />
        <div className="w-32 h-8 bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  const currentTheme = theme ? getTheme(theme) : allThemes[0];

  const ThemePreview = ({ themeName }: { themeName: string }) => {
    const themeConfig = getTheme(themeName);
    
    return (
      <div className="flex items-center gap-3 w-full">
        <div className="flex gap-1">
          <div 
            className="w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: themeConfig.primary }}
          />
          <div 
            className="w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: themeConfig.secondary }}
          />
          <div 
            className="w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: themeConfig.preview.card }}
          />
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-medium text-sm text-white">{themeConfig.label}</span>
          <span className="text-xs text-gray-300">
            {themeConfig.description}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Palette className="h-4 w-4 text-gray-400" />
      <span className="text-sm text-gray-400">Choose Theme:</span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="justify-between min-w-[160px] h-8 py-1 px-3 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div 
                  className="w-2 h-2 rounded-full border border-gray-400"
                  style={{ backgroundColor: currentTheme.primary }}
                />
                <div 
                  className="w-2 h-2 rounded-full border border-gray-400"
                  style={{ backgroundColor: currentTheme.secondary }}
                />
              </div>
              <span className="text-xs font-medium">
                {currentTheme.label}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-[280px] max-h-[400px] overflow-y-auto bg-gray-800 border-gray-700"
        >
          <DropdownMenuLabel className="text-xs uppercase tracking-wider text-gray-400">
            Choose Theme
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          
          {allThemes.map((themeConfig) => (
            <DropdownMenuItem
              key={themeConfig.name}
              className="p-3 cursor-pointer hover:bg-gray-700 transition-colors text-white focus:bg-gray-700 focus:text-white"
              onClick={() => setTheme(themeConfig.name)}
            >
              <div className="flex items-center justify-between w-full">
                <ThemePreview themeName={themeConfig.name} />
                {theme === themeConfig.name && (
                  <Check className="w-4 h-4 text-primary ml-2 flex-shrink-0" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}