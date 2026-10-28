# Feature Flags Guide

This document explains how to use the modular feature flag system implemented for components like UrgencyTimer.

## Overview

The feature flag system allows you to enable or disable components on a per-locale basis, making it easy to customize the user experience for different regions.

## Configuration

Feature flags are configured in `src/config/app-config.ts` in the `FEATURE_FLAGS` object:

```typescript
export const FEATURE_FLAGS = {
  components: {
    urgencyTimer: {
      enabled: {
        rs: false,  // Disabled for RS locale
        ba: true,   // Enabled for BA locale
      }
    },
    // Add more component feature flags here as needed
  }
} as const;
```

## Usage

### 1. Component Level (Automatic)

The `UrgencyTimer` component automatically checks its feature flag using the `isComponentEnabled` helper:

```typescript
export function UrgencyTimer({ duration, className }: UrgencyTimerProps) {
  const locale = useLocale();
  
  // Check if UrgencyTimer is enabled for current locale
  if (!isComponentEnabled('urgencyTimer', locale)) {
    return null;
  }
  
  // ... rest of component logic
}
```

### 2. Parent Component Level (Additional Safety)

You can also check feature flags in parent components for additional control:

```typescript
{product.urgencyElements.limitedTime && isComponentEnabled('urgencyTimer', currentLocale) && (
  <UrgencyTimer duration={24} />
)}
```

## Helper Function

The `isComponentEnabled` function provides a clean API for checking feature flags:

```typescript
isComponentEnabled(component: keyof typeof FEATURE_FLAGS.components, locale: string): boolean
```

- Returns `true` if the component is enabled for the given locale
- Returns `true` by default if the component or locale is not configured (fail-safe)
- Returns `false` only when explicitly disabled

## Current Status

- **UrgencyTimer**: 
  - ✅ **Disabled** for RS locale
  - ✅ **Enabled** for BA locale

## Adding New Feature Flags

To add feature flags for other components:

1. Add the component to `FEATURE_FLAGS.components` in `app-config.ts`
2. Import `isComponentEnabled` in your component
3. Add the feature flag check at the component level or parent level
4. Update this documentation

### Example for a new component:

```typescript
// In app-config.ts
wheelOfFortune: {
  enabled: {
    rs: true,
    ba: false,
  }
}

// In your component
if (!isComponentEnabled('wheelOfFortune', locale)) {
  return null;
}
```

## Benefits

- **Modular**: Easy to enable/disable features per locale
- **Maintainable**: Centralized configuration
- **Safe**: Defaults to enabled if not configured
- **Flexible**: Can be checked at component or parent level
- **Type-safe**: Full TypeScript support
