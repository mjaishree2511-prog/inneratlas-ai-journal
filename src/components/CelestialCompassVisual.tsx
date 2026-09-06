import React from 'react';

interface CelestialCompassVisualProps {
  className?: string;
  size?: number;
}

/**
 * An elegant, abstract SVG representing the InnerAtlas mind-compass,
 * thought constellations, reflection horizons, and cognitive exploration.
 * Lightweight, accessible, and responsive with zero external dependencies.
 */
export const CelestialCompassHeroVisual: React.FC<CelestialCompassVisualProps> = ({
  className = '',
  size = 280,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Soft Ambient Radial Background Glow */}
      <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-amber-500/15 via-orange-400/10 to-teal-400/10 dark:from-amber-400/20 dark:via-amber-500/10 dark:to-teal-500/10 blur-2xl transform-gpu" />

      <svg
        width={size}
        height={size}
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full max-w-[280px] h-auto drop-shadow-sm"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id="centerCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Ambient Aura */}
        <circle cx="140" cy="140" r="100" fill="url(#centerCoreGlow)" />

        {/* Outer Degree Track / Horizon Ring */}
        <circle
          cx="140"
          cy="140"
          r="126"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 6"
          className="text-stone-300/80 dark:text-stone-700/80"
        />

        {/* Secondary Concentric Compass Ring */}
        <circle
          cx="140"
          cy="140"
          r="108"
          stroke="url(#orbitGradient)"
          strokeWidth="1.5"
        />

        {/* Inner Celestial Circle */}
        <circle
          cx="140"
          cy="140"
          r="84"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 8"
          className="text-amber-500/30 dark:text-amber-400/30"
        />

        {/* Cardinal Axis Lines */}
        <line
          x1="140"
          y1="20"
          x2="140"
          y2="260"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-stone-300 dark:text-stone-700"
        />
        <line
          x1="20"
          y1="140"
          x2="260"
          y2="140"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-stone-300 dark:text-stone-700"
        />

        {/* Elliptical Thought Orbits */}
        <ellipse
          cx="140"
          cy="140"
          rx="118"
          ry="44"
          transform="rotate(-25 140 140)"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-amber-500/40 dark:text-amber-400/40"
        />
        <ellipse
          cx="140"
          cy="140"
          rx="118"
          ry="44"
          transform="rotate(35 140 140)"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 5"
          className="text-teal-600/30 dark:text-teal-400/30"
        />

        {/* Geometric Reflection Core (Stylized Lotus / Compass Rose) */}
        {/* North Pointer */}
        <polygon
          points="140,78 147,136 140,140"
          fill="url(#goldGradient)"
          filter="url(#softGlow)"
        />
        <polygon
          points="140,78 133,136 140,140"
          fill="#b45309"
          fillOpacity="0.8"
        />
        {/* South Pointer */}
        <polygon
          points="140,202 147,144 140,140"
          fill="#d97706"
          fillOpacity="0.8"
        />
        <polygon
          points="140,202 133,144 140,140"
          fill="#78350f"
          fillOpacity="0.7"
        />
        {/* East Pointer */}
        <polygon
          points="202,140 144,147 140,140"
          fill="#f59e0b"
          fillOpacity="0.85"
        />
        <polygon
          points="202,140 144,133 140,140"
          fill="#b45309"
          fillOpacity="0.7"
        />
        {/* West Pointer */}
        <polygon
          points="78,140 136,147 140,140"
          fill="#d97706"
          fillOpacity="0.85"
        />
        <polygon
          points="78,140 136,133 140,140"
          fill="#92400e"
          fillOpacity="0.7"
        />

        {/* Diagonal Subtle Petals */}
        <polygon
          points="176,104 145,138 140,140"
          fill="#fbbf24"
          fillOpacity="0.6"
        />
        <polygon
          points="104,104 135,138 140,140"
          fill="#d97706"
          fillOpacity="0.5"
        />
        <polygon
          points="176,176 145,142 140,140"
          fill="#d97706"
          fillOpacity="0.5"
        />
        <polygon
          points="104,176 135,142 140,140"
          fill="#b45309"
          fillOpacity="0.5"
        />

        {/* Central Pivot Core Jewel */}
        <circle cx="140" cy="140" r="7" fill="#ffffff" />
        <circle cx="140" cy="140" r="5" fill="#f59e0b" />
        <circle cx="140" cy="140" r="2.5" fill="#78350f" />

        {/* Orbiting Insight Constellation Nodes */}
        {/* Node 1 - Growth */}
        <circle cx="232" cy="100" r="4.5" fill="#f59e0b" />
        <circle cx="232" cy="100" r="8" stroke="#f59e0b" strokeOpacity="0.3" strokeWidth="1" />

        {/* Node 2 - Clarity */}
        <circle cx="52" cy="180" r="3.5" fill="#14b8a6" />
        <circle cx="52" cy="180" r="6" stroke="#14b8a6" strokeOpacity="0.3" strokeWidth="1" />

        {/* Node 3 - Mindful Presence */}
        <circle cx="218" cy="192" r="3" fill="#fbbf24" />

        {/* Node 4 - Discovery */}
        <circle cx="70" cy="92" r="2.5" fill="#f59e0b" />

        {/* Sparkling Star Accents */}
        <path
          d="M 140 38 L 142 46 L 150 48 L 142 50 L 140 58 L 138 50 L 130 48 L 138 46 Z"
          fill="url(#goldGradient)"
        />
        <path
          d="M 242 140 L 243.5 145 L 248.5 146.5 L 243.5 148 L 242 153 L 240.5 148 L 235.5 146.5 L 240.5 145 Z"
          fill="#f59e0b"
          fillOpacity="0.8"
        />
      </svg>
    </div>
  );
};

/**
 * Beautiful, bespoke empty state SVG illustration showing an open journal
 * with growing leafy thoughts, celestial stars, and warm lighting.
 */
export const EmptyJournalIllustration: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-200/40 via-amber-300/20 to-transparent dark:from-amber-900/30 dark:via-amber-800/15 dark:to-transparent blur-xl" />

      <svg
        width="180"
        height="140"
        viewBox="0 0 180 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full max-w-[180px] h-auto drop-shadow-xs"
      >
        <defs>
          <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="pageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <linearGradient id="bookmarkGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Ambient Rising Mind Stars */}
        <circle cx="90" cy="22" r="3" fill="#f59e0b" />
        <path
          d="M 125 32 L 126.5 35.5 L 130 37 L 126.5 38.5 L 125 42 L 123.5 38.5 L 120 37 L 123.5 35.5 Z"
          fill="#fbbf24"
        />
        <path
          d="M 55 36 L 56.5 39.5 L 60 41 L 56.5 42.5 L 55 46 L 53.5 42.5 L 50 41 L 53.5 39.5 Z"
          fill="#f59e0b"
        />
        <circle cx="145" cy="50" r="2" fill="#14b8a6" />
        <circle cx="35" cy="54" r="2" fill="#f59e0b" />

        {/* Journal Leather Backing / Shadow */}
        <rect
          x="26"
          y="68"
          width="128"
          height="54"
          rx="6"
          fill="url(#bookCover)"
          className="dark:opacity-90"
        />

        {/* Left Page */}
        <path
          d="M 32 72 Q 58 70 88 74 L 88 116 Q 58 113 32 115 Z"
          fill="url(#pageGradient)"
          stroke="#e7e5e4"
          strokeWidth="1"
          className="dark:fill-stone-800 dark:stroke-stone-700"
        />

        {/* Left Page Writing Lines */}
        <line x1="42" y1="82" x2="78" y2="82" stroke="#d6d3d1" strokeWidth="1.5" strokeLinecap="round" className="dark:stroke-stone-700" />
        <line x1="42" y1="90" x2="75" y2="90" stroke="#d6d3d1" strokeWidth="1.5" strokeLinecap="round" className="dark:stroke-stone-700" />
        <line x1="42" y1="98" x2="70" y2="98" stroke="#d6d3d1" strokeWidth="1.5" strokeLinecap="round" className="dark:stroke-stone-700" />
        <line x1="42" y1="106" x2="62" y2="106" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right Page */}
        <path
          d="M 148 72 Q 122 70 92 74 L 92 116 Q 122 113 148 115 Z"
          fill="url(#pageGradient)"
          stroke="#e7e5e4"
          strokeWidth="1"
          className="dark:fill-stone-800 dark:stroke-stone-700"
        />

        {/* Right Page Writing Lines */}
        <line x1="102" y1="82" x2="138" y2="82" stroke="#d6d3d1" strokeWidth="1.5" strokeLinecap="round" className="dark:stroke-stone-700" />
        <line x1="102" y1="90" x2="135" y2="90" stroke="#d6d3d1" strokeWidth="1.5" strokeLinecap="round" className="dark:stroke-stone-700" />
        <line x1="102" y1="98" x2="138" y2="98" stroke="#d6d3d1" strokeWidth="1.5" strokeLinecap="round" className="dark:stroke-stone-700" />
        <line x1="102" y1="106" x2="124" y2="106" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" />

        {/* Center Spine Crease */}
        <line x1="90" y1="73" x2="90" y2="117" stroke="#b45309" strokeWidth="2" />

        {/* Golden Silk Bookmark Ribbon */}
        <path
          d="M 90 73 C 90 85 96 95 98 122 L 94 119 L 90 122 L 90 73 Z"
          fill="url(#bookmarkGold)"
        />

        {/* Subtle Botanical Sprout (Personal Growth Symbol) */}
        <path
          d="M 90 68 C 88 56 78 50 72 52 C 70 56 76 66 90 68 Z"
          fill="#14b8a6"
          fillOpacity="0.85"
        />
        <path
          d="M 90 66 C 92 54 102 48 108 50 C 110 54 104 64 90 66 Z"
          fill="#10b981"
          fillOpacity="0.85"
        />
      </svg>
    </div>
  );
};
