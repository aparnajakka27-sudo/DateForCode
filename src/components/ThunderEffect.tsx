'use client';

import React, { useEffect, useState, useRef } from 'react';

// 3 SVG bolt variations (classic jagged branching)
const SVG_BOLTS = [
  <polygon points="15,0 5,30 20,30 0,100 30,25 15,25" fill="currentColor" key="bolt-1" />,
  <polygon points="20,0 0,40 25,45 -5,100 35,35 15,30" fill="currentColor" key="bolt-2" />,
  <polygon points="10,0 0,35 15,35 5,100 25,40 12,40" fill="currentColor" key="bolt-3" />
];

export default function ThunderEffect() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeBolt, setActiveBolt] = useState<{ id: number, type: number, left: number, scale: number } | null>(null);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check if the user prefers reduced motion for accessibility
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const triggerLightning = () => {
      // Random intensity between 0.3 and 0.9 for the flash
      const intensity = 0.3 + Math.random() * 0.6;
      
      // Inject CSS variable for global UI illumination (GPU-accelerated overlay and shadows)
      document.documentElement.style.setProperty('--lightning-intensity', intensity.toString());

      // 35% chance to render a visible lightning bolt
      if (Math.random() < 0.35) {
        setActiveBolt({
          id: Date.now(),
          type: Math.floor(Math.random() * SVG_BOLTS.length),
          left: 10 + Math.random() * 80, // Random position across screen width
          scale: 0.8 + Math.random() * 1.2 // Scale variation for depth
        });
      }

      // Flash lasts briefly before fading (random duration 100ms - 350ms)
      const flashDuration = 100 + Math.random() * 250;
      
      if (flashResetRef.current) clearTimeout(flashResetRef.current);
      
      flashResetRef.current = setTimeout(() => {
        document.documentElement.style.setProperty('--lightning-intensity', '0');
        setActiveBolt(null); // Clear bolt
      }, flashDuration);

      // Schedule next flash organically (around ~1.8 to 2.5 seconds)
      const nextInterval = 1800 + Math.random() * 700;
      timerRef.current = setTimeout(triggerLightning, nextInterval);
    };

    // Initial kickoff
    timerRef.current = setTimeout(triggerLightning, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (flashResetRef.current) clearTimeout(flashResetRef.current);
      document.documentElement.style.setProperty('--lightning-intensity', '0');
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null; // Entirely disabled if user prefers reduced motion
  }

  return (
    <div className="thunder-ambient-overlay pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {activeBolt && (
        <svg
          key={activeBolt.id}
          viewBox="-10 -10 50 120"
          className="absolute top-[-5%] text-white dark:text-[#E0E7FF] opacity-90 mix-blend-screen"
          style={{
            left: `${activeBolt.left}%`,
            width: '80px',
            height: '70vh',
            transform: `scale(${activeBolt.scale})`,
            filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8)) blur(0.5px)',
            transition: 'opacity 0.1s ease-out'
          }}
          preserveAspectRatio="none"
        >
          {SVG_BOLTS[activeBolt.type]}
        </svg>
      )}
    </div>
  );
}
