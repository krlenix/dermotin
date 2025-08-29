"use client"

import React from 'react';
import { useTheme } from 'next-themes';
import { getAllThemes } from '@/config/themes';
import { ThemePreviewCard, ThemeSelector } from '@/components/ui/theme-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Palette, Sparkles } from 'lucide-react';

export function ThemeShowcase() {
  const { theme, setTheme } = useTheme();
  const allThemes = getAllThemes();

  const DemoCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              Primary
            </Button>
            <Button size="sm" variant="secondary" className="flex-1">
              Secondary
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Outline
            </Button>
            <Button size="sm" variant="ghost" className="flex-1">
              Ghost
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Theme Showcase</h1>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Choose from {allThemes.length} beautiful themes to customize your experience
          </p>
          <div className="flex justify-center">
            <ThemeSelector />
          </div>
        </div>

        {/* Current Theme Demo */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Current Theme Preview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DemoCard 
              title="Shopping Experience"
              description="See how buttons and cards look"
              icon={ShoppingCart}
            />
            <DemoCard 
              title="Interactive Elements"
              description="Hover effects and animations"
              icon={Star}
            />
            <DemoCard 
              title="Brand Integration"
              description="Colors that match your style"
              icon={Heart}
            />
          </div>

          {/* Color Palette Display */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Current Color Palette
              </CardTitle>
              <CardDescription>
                The color scheme of your selected theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-16 bg-primary rounded-lg border"></div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Primary</p>
                    <p className="text-xs text-muted-foreground">Main brand color</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-secondary rounded-lg border"></div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Secondary</p>
                    <p className="text-xs text-muted-foreground">Supporting color</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-accent rounded-lg border"></div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Accent</p>
                    <p className="text-xs text-muted-foreground">Highlight color</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-muted rounded-lg border"></div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Muted</p>
                    <p className="text-xs text-muted-foreground">Subtle background</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-card rounded-lg border"></div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Card</p>
                    <p className="text-xs text-muted-foreground">Card background</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-16 bg-background border rounded-lg"></div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Background</p>
                    <p className="text-xs text-muted-foreground">Page background</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Themes Grid */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">All Available Themes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allThemes.map((themeConfig) => (
              <ThemePreviewCard
                key={themeConfig.name}
                themeName={themeConfig.name}
                isSelected={theme === themeConfig.name}
                onSelect={() => setTheme(themeConfig.name)}
              />
            ))}
          </div>
        </div>

        {/* Theme Statistics */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Theme Collection Stats</CardTitle>
              <CardDescription>Our comprehensive theme library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary">{allThemes.length}</div>
                  <p className="text-sm text-muted-foreground">Total Themes</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {allThemes.filter(t => t.name.includes('dark') || t.name === 'neon').length || 2}
                  </div>
                  <p className="text-sm text-muted-foreground">Dark Themes</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {allThemes.filter(t => ['natural', 'forest', 'ocean'].includes(t.name)).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Nature Inspired</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {allThemes.filter(t => ['neon', 'sunset'].includes(t.name)).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Vibrant Colors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}