import React, { useEffect, useRef, useCallback } from 'react';

interface ConfettiEffectProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number;
  colors?: string[];
  particleCount?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  shape: 'rect' | 'circle';
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  isActive,
  onComplete,
  duration = 3000,
  colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#E74C3C', '#9B59B6'],
  particleCount = 150,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const startTime = useRef<number>(0);

  // Create particles
  const createParticles = useCallback((): Particle[] => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = Math.random() * 12 + 8;
      const life = Math.random() * 2000 + 1000; // 1-3 seconds
      
      newParticles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - Math.random() * 5, // Slight upward bias
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        life,
        maxLife: life,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }
    
    return newParticles;
  }, [particleCount]);

  // Update particle physics
  const updateParticles = (deltaTime: number) => {
    particles.current = particles.current.filter(particle => {
      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      
      // Apply gravity
      particle.vy += 0.5 * deltaTime;
      
      // Apply air resistance
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Update rotation
      particle.rotation += particle.rotationSpeed * deltaTime;
      
      // Update life
      particle.life -= deltaTime * 16; // Convert to ~60fps
      particle.opacity = Math.max(0, particle.life / particle.maxLife);
      
      // Remove dead particles or those that fell off screen
      return particle.life > 0 && particle.y < window.innerHeight + 100;
    });
  };

  // Render particles
  const renderParticles = (ctx: CanvasRenderingContext2D) => {
    particles.current.forEach(particle => {
      ctx.save();
      
      // Set opacity
      ctx.globalAlpha = particle.opacity;
      
      // Move to particle position
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      
      // Set color
      ctx.fillStyle = particle.color;
      
      // Draw shape
      if (particle.shape === 'rect') {
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    });
  };

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (!startTime.current) {
      startTime.current = currentTime;
    }

    const elapsed = currentTime - startTime.current;
    const deltaTime = Math.min(16, elapsed - (elapsed % 16)) / 16; // Cap at 60fps

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Update and render particles
    updateParticles(deltaTime);
    renderParticles(ctx);

    // Continue animation if particles exist and within duration
    if (particles.current.length > 0 && elapsed < duration) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      if (onComplete) {
        onComplete();
      }
    }
  }, [duration, onComplete]);

  // Resize canvas
  const resizeCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  };

  // Start confetti animation
  useEffect(() => {
    if (isActive && canvasRef.current) {
      // Reset animation state
      particles.current = createParticles();
      startTime.current = 0;
      
      // Resize canvas
      resizeCanvas();
      
      // Start animation
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  // Handle window resize
  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial resize
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};
