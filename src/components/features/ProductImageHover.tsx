'use client';

import { useState, useEffect } from 'react';
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
  const [validHoverImage, setValidHoverImage] = useState<string>(mainImage);
  const [isValidatingHover, setIsValidatingHover] = useState(false);
  
  // Validate hover image on mount and when hoverImage changes
  useEffect(() => {
    const validateHoverImage = async () => {
      // If hover image is the same as main image, no need to validate
      if (hoverImage === mainImage) {
        setValidHoverImage(mainImage);
        return;
      }
      
      setIsValidatingHover(true);
      
      try {
        // Create a new image to test if the hover image loads
        const img = new window.Image();
        
        const isValid = await new Promise<boolean>((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = hoverImage;
        });
        
        // Use hover image if valid, otherwise fall back to main image
        setValidHoverImage(isValid ? hoverImage : mainImage);
      } catch {
        // On any error, fall back to main image
        setValidHoverImage(mainImage);
      } finally {
        setIsValidatingHover(false);
      }
    };
    
    validateHoverImage();
  }, [hoverImage, mainImage]);
  
  // Check if we have different images for hover effect
  const hasDifferentImages = mainImage !== validHoverImage && !isValidatingHover;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hasDifferentImages ? (
        <>
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
            src={validHoverImage}
            alt={`${productName} - hover view`}
            width={width}
            height={height}
            className={`absolute inset-0 object-contain w-full h-full transition-all duration-700 ease-in-out transform ${
              isHovered ? 'opacity-100 scale-105 rotate-2' : 'opacity-0 scale-95 rotate-0'
            }`}
          />
        </>
      ) : (
        /* Single Image - just subtle hover effects */
        <Image
          src={mainImage}
          alt={productName}
          width={width}
          height={height}
          className={`object-contain w-full h-full transition-all duration-500 ease-in-out transform ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
      )}
      
      {/* Subtle shimmer effect on hover - only for different images */}
      {hasDifferentImages && (
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 ${
          isHovered ? 'translate-x-full opacity-100' : '-translate-x-full opacity-0'
        }`} />
      )}
      
      {/* Optional overlay effect - more subtle for single images */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/${hasDifferentImages ? '3' : '1'} via-transparent to-transparent transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
}
