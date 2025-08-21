# Wheel of Fortune Setup Guide

## Quick Start

The wheel of fortune component is now integrated into your landing page and will automatically appear after 5 seconds by default.

## Easy Configuration

### 1. Enable/Disable the Wheel

To **disable** the wheel completely, add this to your `.env.local` file:
```env
NEXT_PUBLIC_WHEEL_ENABLED=false
```

To **enable** it again:
```env
NEXT_PUBLIC_WHEEL_ENABLED=true
```

### 2. Adjust Timing

Change the delay before the wheel appears (in milliseconds):
```env
NEXT_PUBLIC_WHEEL_DELAY=3000  # 3 seconds instead of 5
```

### 3. Control Frequency

Show the wheel every time (not just once per session):
```env
NEXT_PUBLIC_WHEEL_SHOW_ONCE=false
```

### 4. Development Mode

For testing, force the wheel to show immediately:
```env
NEXT_PUBLIC_WHEEL_FORCE_SHOW=true
NEXT_PUBLIC_WHEEL_SKIP_DELAY=true
```

## Environment Variables Reference

Create a `.env.local` file in your project root with these variables:

```env
# Master toggle
NEXT_PUBLIC_WHEEL_ENABLED=true

# Timing
NEXT_PUBLIC_WHEEL_DELAY=5000
NEXT_PUBLIC_WHEEL_SHOW_ONCE=true

# Themes
NEXT_PUBLIC_WHEEL_THEME=ecommerce
NEXT_PUBLIC_WHEEL_ANIMATION=normal
NEXT_PUBLIC_WHEEL_COLOR_THEME=golden

# Development
NEXT_PUBLIC_WHEEL_FORCE_SHOW=false
NEXT_PUBLIC_WHEEL_SKIP_DELAY=false
```

## Customization Options

### Themes
- `ecommerce` - Discount-focused prizes
- `restaurant` - Food service prizes
- `service` - Service business prizes

### Animation Speeds
- `quick` - Fast animations
- `normal` - Standard timing
- `dramatic` - Slower, more suspenseful

### Color Themes
- `golden` - Gold and warm colors
- `modern` - Cool, modern palette
- `vibrant` - Bright, energetic colors
- `elegant` - Dark, sophisticated
- `casino` - Red and gold casino style

## Advanced Configuration

### Custom Prizes

Edit `src/config/wheel/prizes.ts` to customize prizes:

```typescript
export const CUSTOM_PRIZES: Prize[] = [
  {
    id: 'my_prize',
    label: '25% OFF',
    value: 25,
    couponCode: 'SAVE25',
    probability: 0.3,
    color: '#FF6B6B',
    textColor: '#FFFFFF',
    icon: '🎁',
    isWinning: true,
  },
  // ... more prizes
];
```

### Custom Behavior

Edit `src/config/wheel/behavior.ts` to change spin patterns:

```typescript
export const CUSTOM_BEHAVIOR: BehaviorConfig = {
  firstSpinOutcome: 'almost_win',
  secondSpinOutcome: 'fake_lose_then_win',
  tensionDelay: 1500, // More suspense
  almostWinMargin: 10, // Closer to winning
};
```

## Integration Points

### Prize Won Handler

The wheel automatically saves won coupons to localStorage. You can customize the `handlePrizeWon` function in `src/app/[locale]/page.tsx`:

```typescript
const handlePrizeWon = (couponCode: string) => {
  // Save to database
  // Send analytics event
  // Show notification
  // Apply to cart automatically
  console.log('Won coupon:', couponCode);
};
```

### Analytics Integration

Add tracking to the wheel events by modifying the configuration or adding event listeners.

## Browser Developer Tools

In development mode, you'll see dev controls in the bottom-right corner to:
- Force show the wheel
- Reset storage (show again)
- Toggle wheel on/off

## Deployment

For Vercel deployment, add environment variables in your Vercel dashboard under Settings > Environment Variables.

## Troubleshooting

### Wheel Not Showing
1. Check `NEXT_PUBLIC_WHEEL_ENABLED` is `true`
2. Clear browser localStorage and cookies
3. Check browser console for errors

### Wheel Shows Too Often
1. Set `NEXT_PUBLIC_WHEEL_SHOW_ONCE=true`
2. Clear storage to reset

### Animations Not Smooth
1. Check browser hardware acceleration is enabled
2. Test on different devices
3. Consider reducing `particleCount` in confetti config

## Performance Notes

- The wheel uses hardware-accelerated CSS animations
- Confetti is optimized with requestAnimationFrame
- Components lazy load to minimize bundle size
- All animations respect `prefers-reduced-motion`

## Accessibility

The wheel includes:
- ARIA labels for screen readers
- Keyboard navigation support
- Focus trapping in modals
- High contrast mode compatibility
- Reduced motion preferences

## Support

For issues or customization help, check:
1. Browser console for error messages
2. Network tab for failed requests
3. Component props and configuration files
4. This documentation for configuration options
