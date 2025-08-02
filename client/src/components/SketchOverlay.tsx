import { useEffect, useRef } from 'react';

interface SketchOverlayProps {
  isActive: boolean;
  intensity?: number;
}

export default function SketchOverlay({ isActive, intensity = 0.7 }: SketchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (isActive) {
      // Apply sketch filter effect
      overlayRef.current.style.opacity = intensity.toString();
      overlayRef.current.style.display = 'block';
    } else {
      overlayRef.current.style.opacity = '0';
      overlayRef.current.style.display = 'none';
    }
  }, [isActive, intensity]);

  return (
    <div
      ref={overlayRef}
      className={`absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-multiply ${isActive ? 'animate-sketch-effect' : ''}`}
      style={{
        background: `
          radial-gradient(circle at 20% 50%, transparent 20%, rgba(0,0,0,0.1) 21%, rgba(0,0,0,0.1) 25%, transparent 26%),
          radial-gradient(circle at 40% 40%, transparent 20%, rgba(0,0,0,0.1) 21%, rgba(0,0,0,0.1) 25%, transparent 26%),
          radial-gradient(circle at 60% 60%, transparent 20%, rgba(0,0,0,0.1) 21%, rgba(0,0,0,0.1) 25%, transparent 26%),
          radial-gradient(circle at 80% 30%, transparent 20%, rgba(0,0,0,0.1) 21%, rgba(0,0,0,0.1) 25%, transparent 26%),
          linear-gradient(45deg, transparent 46%, rgba(0,0,0,0.05) 47%, rgba(0,0,0,0.05) 48%, transparent 49%),
          linear-gradient(-45deg, transparent 46%, rgba(0,0,0,0.05) 47%, rgba(0,0,0,0.05) 48%, transparent 49%)
        `,
        backgroundSize: '12px 12px, 15px 15px, 18px 18px, 14px 14px, 8px 8px, 8px 8px',
        filter: 'contrast(1.2) brightness(0.9)',
        opacity: 0,
        display: 'none'
      }}
    >
      {/* Additional sketch lines effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(0,0,0,0.03) 3px,
              rgba(0,0,0,0.03) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 5px,
              rgba(0,0,0,0.02) 5px,
              rgba(0,0,0,0.02) 6px
            )
          `
        }}
      />
      
      {/* Sketch texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top left, transparent 40%, rgba(0,0,0,0.05) 70%),
            radial-gradient(ellipse at bottom right, transparent 40%, rgba(0,0,0,0.05) 70%),
            radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.03) 100%)
          `,
          filter: 'blur(0.5px)'
        }}
      />
    </div>
  );
}