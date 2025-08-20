'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: {
    main: string;
    gallery: string[];
  };
  productName: string;
  className?: string;
}

export function EnhancedImageGallery({ images, productName, className }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | 'fade'>('fade');
  const [imageKey, setImageKey] = useState(0); // Force re-render for transitions
  
  // Touch/swipe functionality refs and state
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Combine main image with gallery for full collection
  const allImages = [images.main, ...images.gallery];
  
  const changeImage = (newIndex: number, direction: 'left' | 'right' | 'fade' = 'fade') => {
    if (isTransitioning || newIndex === selectedImage) return;
    
    setTransitionDirection(direction);
    setIsTransitioning(true);
    
    // Start exit animation
    setTimeout(() => {
      setSelectedImage(newIndex);
      setImageKey(prev => prev + 1); // Force re-render
      
      // End transition after entrance animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200); // Quicker entrance duration
    }, 150); // Quicker exit duration
  };
  
  const handlePrevious = () => {
    const newIndex = selectedImage === 0 ? allImages.length - 1 : selectedImage - 1;
    changeImage(newIndex, 'right');
  };
  
  const handleNext = () => {
    const newIndex = selectedImage === allImages.length - 1 ? 0 : selectedImage + 1;
    changeImage(newIndex, 'left');
  };
  
  const handleThumbnailClick = (index: number) => {
    changeImage(index, 'fade');
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    touchEndX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance for a swipe
    
    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swipe left - go to next image
        handleNext();
      } else {
        // Swipe right - go to previous image
        handlePrevious();
      }
    }
    
    // Reset touch values
    touchStartX.current = 0;
    touchEndX.current = 0;
    isDragging.current = false;
  };

  // Get animation classes based on transition state
  const getImageAnimationClasses = () => {
    if (!isTransitioning) {
      return 'opacity-100 scale-100 translate-y-0';
    }
    
    switch (transitionDirection) {
      case 'left':
        return 'opacity-0 scale-105 -translate-y-4';
      case 'right':
        return 'opacity-0 scale-105 translate-y-4';
      case 'fade':
        return 'opacity-0 scale-95 translate-y-0';
      default:
        return 'opacity-0 scale-95 translate-y-0';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Layout: Side by side */}
      <div className="hidden md:flex gap-4">
        {/* Thumbnails - Left side on desktop */}
        <div className="flex flex-col gap-3 w-28">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              disabled={isTransitioning}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-105",
                "bg-white shadow-sm hover:shadow-md group/thumb",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selectedImage === index
                  ? "border-brand-orange shadow-lg ring-2 ring-brand-orange/30 scale-105"
                  : "border-gray-200 hover:border-brand-orange/50",
                isTransitioning ? "pointer-events-none" : ""
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                fill
                className={cn(
                  "object-cover transition-all duration-300",
                  "group-hover/thumb:scale-110 group-hover/thumb:brightness-110",
                  selectedImage === index ? "scale-105" : "scale-100"
                )}
                sizes="112px"
              />
              {/* Active indicator with pulse */}
              {selectedImage === index && (
                <div className="absolute inset-0 bg-brand-orange/10 border border-brand-orange/30 rounded-lg animate-pulse" />
              )}
              {/* Click ripple effect */}
              <div className="absolute inset-0 bg-brand-orange/0 group-active/thumb:bg-brand-orange/20 transition-colors duration-150 rounded-lg" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-200 rounded-lg" />

            </button>
          ))}
        </div>

        {/* Main Image Display - Desktop */}
        <div className="flex-1 relative">
          <div 
            ref={imageContainerRef}
            className="relative aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden group"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main Image with Enhanced Transitions */}
            <div className="relative w-full h-full">
              <div 
                key={imageKey}
                className={cn(
                  "absolute inset-0 transition-all duration-300 ease-out transform",
                  getImageAnimationClasses()
                )}

              >
                <Image
                  src={allImages[selectedImage]}
                  alt={`${productName} - Image ${selectedImage + 1}`}
                  fill
                  className={cn(
                    "object-cover transition-all duration-500 ease-out",
                    isZoomed ? "scale-150" : "scale-100",
                    "hover:scale-105"
                  )}
                  priority={selectedImage === 0}
                  sizes="50vw"
                />
              </div>

            </div>

            {/* Navigation arrows */}
            <button
              onClick={handlePrevious}
              disabled={isTransitioning}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Zoom button */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              disabled={isTransitioning}
              className={cn(
                "absolute top-4 left-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              <ZoomIn className="h-5 w-5" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedImage + 1} / {allImages.length}
            </div>

            {/* Corner Ribbon - 100% Prirodno */}
            <div className="absolute top-0 right-0 z-20">
              <div 
                className="text-white text-xs font-bold leading-[1.8] px-[1lh] bg-brand-green"
                style={{
                  clipPath: 'polygon(100% 100%, 0 100%, 999px calc(100% - 999px), calc(100% - 999px) calc(100% - 999px))',
                  transform: 'translate(calc((1 - cos(45deg)) * 100%), -100%) rotate(45deg)',
                  transformOrigin: '0% 100%'
                }}
              >
                100% Prirodno
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout: Thumbnails below main image */}
      <div className="md:hidden space-y-6">
        {/* Main Image Display - Mobile */}
        <div className="relative mt-0">
          <div 
            className="relative aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden group"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main Image with Enhanced Transitions */}
            <div className="relative w-full h-full">
              <div 
                key={imageKey}
                className={cn(
                  "absolute inset-0 transition-all duration-300 ease-out transform",
                  getImageAnimationClasses()
                )}

              >
                <Image
                  src={allImages[selectedImage]}
                  alt={`${productName} - Image ${selectedImage + 1}`}
                  fill
                  className={cn(
                    "object-cover transition-all duration-500 ease-out",
                    isZoomed ? "scale-150" : "scale-100",
                    "hover:scale-105"
                  )}
                  priority={selectedImage === 0}
                  sizes="100vw"
                />
              </div>

            </div>

            {/* Navigation arrows - Mobile */}
            <button
              onClick={handlePrevious}
              disabled={isTransitioning}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Zoom button - Mobile */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              disabled={isTransitioning}
              className={cn(
                "absolute top-2 left-2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            {/* Image counter - Mobile */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
              {selectedImage + 1} / {allImages.length}
            </div>

            {/* Corner Ribbon - Mobile */}
            <div className="absolute top-0 right-0 z-20">
              <div 
                className="text-white text-xs font-bold leading-[1.8] px-[1lh] bg-brand-green"
                style={{
                  clipPath: 'polygon(100% 100%, 0 100%, 999px calc(100% - 999px), calc(100% - 999px) calc(100% - 999px))',
                  transform: 'translate(calc((1 - cos(45deg)) * 100%), -100%) rotate(45deg)',
                  transformOrigin: '0% 100%'
                }}
              >
                100% Prirodno
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails - Below main image on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 justify-start px-4 pt-2" style={{maxWidth: '100vw'}}>
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              disabled={isTransitioning}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg border-2 transition-all duration-300 group/thumb-mobile",
                "bg-white shadow-sm hover:shadow-md hover:scale-105",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selectedImage === index
                  ? "border-brand-orange shadow-lg ring-2 ring-brand-orange/30 scale-105"
                  : "border-gray-200 hover:border-brand-orange/50",
                isTransitioning ? "pointer-events-none" : ""
              )}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                fill
                className={cn(
                  "object-cover transition-all duration-300",
                  "group-hover/thumb-mobile:scale-110 group-hover/thumb-mobile:brightness-110",
                  selectedImage === index ? "scale-105" : "scale-100"
                )}
                sizes="64px"
              />
              {/* Active indicator with pulse */}
              {selectedImage === index && (
                <div className="absolute inset-0 bg-brand-orange/10 border border-brand-orange/30 rounded-lg animate-pulse" />
              )}
              {/* Click ripple effect */}
              <div className="absolute inset-0 bg-brand-orange/0 group-active/thumb-mobile:bg-brand-orange/20 transition-colors duration-150 rounded-lg" />

            </button>
          ))}
        </div>

        {/* Image dots indicator - Mobile */}
        <div className="flex justify-center gap-2">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              disabled={isTransitioning}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 hover:scale-150",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selectedImage === index
                  ? "bg-brand-orange scale-125 shadow-lg shadow-brand-orange/50"
                  : "bg-gray-300 hover:bg-brand-orange/50",
                isTransitioning ? "pointer-events-none opacity-50" : ""
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}