export interface ThemeConfig {
  name: string;
  label: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  preview: {
    background: string;
    foreground: string;
    card: string;
  };
}

export const themes: Record<string, ThemeConfig> = {
  default: {
    name: "default",
    label: "Default",
    description: "Classic orange and green theme",
    primary: "#FF6B35",
    secondary: "#608E7E", 
    accent: "#240 4.8% 95.9%",
    preview: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(240 10% 3.9%)",
      card: "hsl(0 0% 100%)"
    }
  },
  
  "yellow-black": {
    name: "yellow-black",
    label: "Yellow & Black",
    description: "Bold yellow with black accents",
    primary: "#FFD700",
    secondary: "#1A1A1A",
    accent: "#FFF8DC",
    preview: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(0 0% 10%)",
      card: "hsl(60 100% 97%)"
    }
  },
  
  "orange-black": {
    name: "orange-black",
    label: "Orange & Black",
    description: "Vibrant orange with deep black",
    primary: "#FF4500",
    secondary: "#0A0A0A",
    accent: "#FFF5EE",
    preview: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(0 0% 4%)",
      card: "hsl(24 100% 97%)"
    }
  },
  
  natural: {
    name: "natural",
    label: "Natural",
    description: "Earth tones and natural colors",
    primary: "#8B4513",
    secondary: "#228B22",
    accent: "#F5F5DC",
    preview: {
      background: "hsl(30 20% 98%)",
      foreground: "hsl(25 25% 25%)",
      card: "hsl(60 20% 95%)"
    }
  },
  
  neutral: {
    name: "neutral",
    label: "Neutral",
    description: "Sophisticated grays and neutrals",
    primary: "#6B7280",
    secondary: "#374151",
    accent: "#F9FAFB",
    preview: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(220 9% 46%)",
      card: "hsl(220 13% 98%)"
    }
  },
  
  "light-blue": {
    name: "light-blue",
    label: "Light Blue",
    description: "Calm and professional blues",
    primary: "#3B82F6",
    secondary: "#1E40AF",
    accent: "#EFF6FF",
    preview: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222 84% 5%)",
      card: "hsl(214 100% 97%)"
    }
  },
  
  neon: {
    name: "neon",
    label: "Neon",
    description: "Electric neon colors",
    primary: "#00FF00",
    secondary: "#FF00FF",
    accent: "#00FFFF",
    preview: {
      background: "hsl(0 0% 3%)",
      foreground: "hsl(120 100% 50%)",
      card: "hsl(0 0% 8%)"
    }
  },
  
  sunset: {
    name: "sunset",
    label: "Sunset",
    description: "Warm sunset gradients",
    primary: "#FF6B6B",
    secondary: "#4ECDC4",
    accent: "#FFE66D",
    preview: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(0 60% 60%)",
      card: "hsl(54 100% 95%)"
    }
  },
  
  forest: {
    name: "forest",
    label: "Forest",
    description: "Deep forest greens",
    primary: "#2D5016",
    secondary: "#355E3B",
    accent: "#90EE90",
    preview: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(100 50% 15%)",
      card: "hsl(120 25% 95%)"
    }
  },
  
  ocean: {
    name: "ocean",
    label: "Ocean",
    description: "Deep ocean blues and teals",
    primary: "#006994",
    secondary: "#4682B4",
    accent: "#B0E0E6",
    preview: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(200 100% 29%)",
      card: "hsl(195 53% 95%)"
    }
  }
};

export const getTheme = (themeName: string): ThemeConfig => {
  return themes[themeName] || themes.default;
};

export const getAllThemes = (): ThemeConfig[] => {
  return Object.values(themes);
};