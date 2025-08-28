'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageHoverProps {
  mainImage: string;
  hoverImage: string;
  productName: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ProductImageHover({
  mainImage,
  hoverImage,
  productName,
  width = 300,
  height = 300,
  className = ''
}: ProductImageHoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <Image
        src={mainImage}
        alt={productName}
        width={width}
        height={height}
        className={`object-contain w-full h-full transition-all duration-700 ease-in-out transform ${
          isHovered ? 'opacity-0 scale-105 rotate-2' : 'opacity-100 scale-100 rotate-0'
        }`}
      />
      
      {/* Hover Image */}
      <Image
        src={hoverImage}
        alt={`${productName} - hover view`}
        width={width}
        height={height}
        className={`absolute inset-0 object-contain w-full h-full transition-all duration-700 ease-in-out transform ${
          isHovered ? 'opacity-100 scale-105 rotate-2' : 'opacity-0 scale-95 rotate-0'
        }`}
      />
      
      {/* Subtle shimmer effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 ${
        isHovered ? 'translate-x-full opacity-100' : '-translate-x-full opacity-0'
      }`} />
      
      {/* Optional overlay effect */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/3 via-transparent to-transparent transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
}
