"use client";
import React, { useEffect, useState } from 'react';

const Logo = ({ className = "", showText = true, size = 45, isDarkBg }: { className?: string, showText?: boolean, size?: number, isDarkBg?: boolean }) => {
  const handleClick = () => {
    window.location.href = '/';
  };

  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (isDarkBg !== undefined) {
      setDark(isDarkBg);
      return;
    }

    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setDark(isDark);
    };

    checkTheme();

    // Listen to themechange events
    window.addEventListener('themechange', checkTheme);
    
    // Also track classList mutations for documentElement (e.g. standard dark-mode libraries)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('themechange', checkTheme);
      observer.disconnect();
    };
  }, [isDarkBg]);

  // Silhouette color: default is bright silver-white for dark mode, dark slate for light mode
  const silhouetteColor = dark ? "#F3F4F6" : "#0E111A";
  // Brand Text: text-white in dark mode looks brilliant, text-[#0E111A] in light mode.
  const textColor = dark ? "text-white" : "text-[#0E111A]";

  return (
    <div 
      onClick={handleClick}
      className={`flex items-center gap-3 cursor-pointer group select-none ${className}`}
    >
      {/* Precision SVG Logo from User Image */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_12px_rgba(255,51,102,0.45)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-12"
      >
        {/* Outer Pink Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          stroke="#FF3366" 
          strokeWidth="10"
        />
        {/* Inner Person Silhouette */}
        <circle cx="50" cy="42" r="10" fill={silhouetteColor} />
        <path 
          d="M32 72C32 64 38 58 50 58C62 58 68 64 68 72" 
          stroke={silhouetteColor} 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
      </svg>

      {/* Brand Text Styling - Sleek developer monospace / sans hybrid */}
      {showText && (
        <div className="flex flex-col justify-center">
          <h1 className={`text-xl font-bold font-mono tracking-wider ${textColor} leading-none whitespace-nowrap transition-colors duration-300`}>
            DATE<span className="text-[#FF3366] drop-shadow-[0_0_8px_rgba(255,51,102,0.4)]">FOR</span>CODE
          </h1>
          <span className="text-[10px] tracking-wide text-[var(--text-muted)] mt-1 font-medium font-sans">
            Stop Ghosting. Start Coding.
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
