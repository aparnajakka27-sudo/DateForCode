"use client";
import React from 'react';

const Logo = ({ className = "", showText = true, size = 45, isDarkBg = true }: { className?: string, showText?: boolean, size?: number, isDarkBg?: boolean }) => {
  const handleClick = () => {
    window.location.href = '/';
  };

  const silhouetteColor = isDarkBg ? "#F3F4F6" : "#1A1A1A";
  const textColor = isDarkBg ? "text-white" : "text-[#1A1A1A]";

  return (
    <div 
      onClick={handleClick}
      className={`flex items-center gap-3 cursor-pointer group ${className}`}
    >
      {/* Precision SVG Logo from User Image */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_10px_rgba(255,51,102,0.2)] transition-transform duration-500 group-hover:rotate-12"
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
        <h1 className={`text-xl font-bold font-mono tracking-wider ${textColor} leading-none whitespace-nowrap`}>
          DATE<span className="text-[#FF3366]">FOR</span>CODE
        </h1>
      )}
    </div>
  );
};

export default Logo;


