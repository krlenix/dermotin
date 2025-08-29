"use client"

import React from 'react';
import { Info, Palette, MousePointer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ThemeInstructions() {
  return (
    <Card className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Palette className="w-5 h-5" />
          How to Change Themes
        </CardTitle>
        <CardDescription className="text-blue-600">
          Customize your experience with beautiful color themes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">1</span>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Find the Theme Selector</h4>
            <p className="text-sm text-blue-600">
              Look for the <Palette className="w-4 h-4 inline mx-1" /> theme selector in the header or footer
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">2</span>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Click to Open</h4>
            <p className="text-sm text-blue-600">
              <MousePointer className="w-4 h-4 inline mr-1" />
              Click the theme selector to see all available themes
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm font-bold">3</span>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Choose Your Theme</h4>
            <p className="text-sm text-blue-600">
              Select from 10 beautiful themes with live preview colors
            </p>
          </div>
        </div>
        
        <div className="bg-blue-100 rounded-lg p-3 mt-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Your theme choice is automatically saved and will persist across visits.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}