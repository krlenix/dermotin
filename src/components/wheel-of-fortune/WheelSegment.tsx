import React from 'react';
import { useTranslations } from 'next-intl';
import { WheelSegment as WheelSegmentType } from '@/types/wheel';

interface WheelSegmentProps {
  segment: WheelSegmentType;
  radius: number;
  isHighlighted?: boolean;
  index: number;
  totalSegments: number;
}

export const WheelSegment: React.FC<WheelSegmentProps> = ({
  segment,
  radius,
  isHighlighted = false,
  index,
  totalSegments,
}) => {
  const t = useTranslations();
  const { prize, startAngle, endAngle, centerAngle } = segment;
  const segmentAngle = endAngle - startAngle;
  
  // Clean Orange-based color scheme using Shadcn colors
  const getSegmentColor = () => {
    if (!prize.isWinning) {
      // Neutral gray for "Try Again"
      return {
        lightHex: '#f1f5f9', // slate-100
        darkHex: '#e2e8f0',  // slate-200
      };
    }

    // Orange gradient based on prize value - higher value = deeper orange
    if (prize.value >= 50) {
      // Highest value - Deep orange
      return {
        lightHex: '#fb923c', // orange-400
        darkHex: '#ea580c',  // orange-600
      };
    } else if (prize.value >= 30) {
      // High value - Medium orange
      return {
        lightHex: '#fdba74', // orange-300
        darkHex: '#f97316',  // orange-500
      };
    } else if (prize.value >= 20) {
      // Medium value - Light orange
      return {
        lightHex: '#fed7aa', // orange-200
        darkHex: '#fb923c',  // orange-400
      };
    } else if (prize.value >= 10) {
      // Lower value - Very light orange
      return {
        lightHex: '#ffedd5', // orange-100
        darkHex: '#fed7aa',  // orange-200
      };
    } else {
      // Lowest value - Minimal orange (still visible)
      return {
        lightHex: '#fff7ed', // orange-50
        darkHex: '#ffedd5',  // orange-100
      };
    }
  };

  const segmentColor = getSegmentColor();

  // Simple segment path - clean pie slice
  const createSegmentPath = (): string => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    const centerX = radius;
    const centerY = radius;
    const outerRadius = radius - 20; // Clean border
    
    // Calculate arc points
    const x1 = centerX + Math.cos(startAngleRad) * outerRadius;
    const y1 = centerY + Math.sin(startAngleRad) * outerRadius;
    const x2 = centerX + Math.cos(endAngleRad) * outerRadius;
    const y2 = centerY + Math.sin(endAngleRad) * outerRadius;

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    return [
      `M ${centerX} ${centerY}`, // Move to center
      `L ${x1} ${y1}`, // Line to start of arc
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc
      'Z', // Close back to center
    ].join(' ');
  };

  // Calculate text position - positioned like the radial lines, along the center axis
  const textRadius = radius * 0.55; // Position text closer to center to stay within circle
  const textAngleRad = (centerAngle * Math.PI) / 180;
  const textX = radius + Math.cos(textAngleRad) * textRadius;
  const textY = radius + Math.sin(textAngleRad) * textRadius;

  // Rotate text to follow the radial direction (like the lines)
  const textRotation = centerAngle;

  // Create gradient for SVG
  const gradientId = `gradient-${segment.id}`;

  return (
    <g className="wheel-segment">
      {/* Define clean gradient */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={segmentColor.lightHex} />
          <stop offset="100%" stopColor={segmentColor.darkHex} />
        </linearGradient>
      </defs>

      {/* Clean segment with subtle gradient */}
      <path
        d={createSegmentPath()}
        fill={`url(#${gradientId})`}
        stroke="#ffffff"
        strokeWidth="1"
        className={`transition-all duration-300 ${
          isHighlighted ? 'brightness-105' : ''
        }`}
        style={{
          filter: isHighlighted
            ? 'brightness(1.05) drop-shadow(0 0 6px rgba(234, 88, 12, 0.4))'
            : 'none',
        }}
      />

      {/* Enhanced text with exciting effects */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={prize.isWinning ? "#1f2937" : "#6b7280"}
        className={`font-bold select-none pointer-events-none ${
          prize.value >= 50 ? 'prize-glow prize-pulse' : 
          prize.value >= 30 ? 'prize-glow' : 
          prize.value >= 20 ? 'prize-pulse' : 
          prize.isWinning ? 'prize-pulse' : ''
        }`}
        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
        style={{
          fontSize: prize.value >= 50 ? '16px' : '14px',
          fontWeight: prize.value >= 50 ? '800' : '700',
          textShadow: prize.isWinning 
            ? `0 2px 4px rgba(255, 255, 255, 0.9), 0 0 8px ${prize.value >= 50 ? 'rgba(234, 88, 12, 0.6)' : 'rgba(251, 146, 60, 0.4)'}` 
            : 'none',
          filter: prize.value >= 50 
            ? 'drop-shadow(0 0 6px rgba(234, 88, 12, 0.8))' 
            : prize.isWinning 
            ? 'drop-shadow(0 0 4px rgba(251, 146, 60, 0.6))' 
            : 'none',
        }}
      >
        {t(prize.label)}
      </text>
    </g>
  );
};
