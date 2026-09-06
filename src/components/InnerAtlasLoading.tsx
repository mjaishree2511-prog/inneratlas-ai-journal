import React, { useState, useEffect } from 'react';

interface InnerAtlasLoadingProps {
  /** Optional custom message array to cycle through */
  messages?: string[];
  /** Subtitle or descriptor */
  subtitle?: string;
  /** Fullscreen mode (default true) or embedded within a card/view */
  fullScreen?: boolean;
  className?: string;
}

const DEFAULT_MESSAGES = [
  'Finding your place...',
  'Gathering your thoughts...',
  'Exploring your InnerAtlas...',
  'Connecting the threads...',
  'Reflecting...',
];

/**
 * Branded InnerAtlas Loading Experience
 * Features:
 * - Geometric celestial compass with subtle orbital rotation
 * - Brand typography and golden accent glow
 * - Smoothly cycling contemplative messages
 * - Reduced-motion compliance (instant fade, no continuous spin)
 */
export const InnerAtlasLoading: React.FC<InnerAtlasLoadingProps> = ({
  messages = DEFAULT_MESSAGES,
  subtitle,
  fullScreen = true,
  className = '',
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      // Begin fade-out
      setFadeState('out');

      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setFadeState('in');
      }, 250); // fade out duration
    }, 2400);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      id="inneratlas-loading-screen"
      role="status"
      aria-live="polite"
      aria-label={messages[currentMessageIndex]}
      className={`flex flex-col items-center justify-center select-none ${
        fullScreen
          ? 'fixed inset-0 z-50 min-h-screen bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-xs'
          : 'w-full py-12'
      } ${className}`}
    >
      {/* Background Soft Glow */}
      <div className="absolute h-64 w-64 rounded-full bg-gradient-to-tr from-amber-500/10 via-amber-400/5 to-teal-400/5 dark:from-amber-500/15 dark:via-amber-400/10 dark:to-teal-400/10 blur-3xl pointer-events-none transform-gpu" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        {/* Abstract InnerAtlas Compass Symbol */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 -m-3 rounded-full bg-amber-400/20 dark:bg-amber-400/25 blur-md" />

          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-stone-800 dark:text-stone-100 drop-shadow-sm"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Orbit Track */}
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 4"
              className="text-stone-300 dark:text-stone-700"
            />

            {/* Rotating Orbital Arc (Disabled for prefers-reduced-motion) */}
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="18 120"
              strokeLinecap="round"
              className="motion-safe:animate-spin origin-center"
              style={{ animationDuration: '4s' }}
            />

            {/* Counter-rotating Subtle Secondary Ring */}
            <circle
              cx="40"
              cy="40"
              r="24"
              stroke="#14b8a6"
              strokeWidth="1"
              strokeDasharray="12 90"
              strokeLinecap="round"
              strokeOpacity="0.7"
              className="motion-safe:animate-spin origin-center"
              style={{ animationDuration: '6s', animationDirection: 'reverse' }}
            />

            {/* Inner Ring */}
            <circle
              cx="40"
              cy="40"
              r="16"
              stroke="currentColor"
              strokeWidth="1"
              className="text-stone-300 dark:text-stone-700"
            />

            {/* Cardinal Points */}
            <line x1="40" y1="8" x2="40" y2="12" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="40" y1="68" x2="40" y2="72" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="40" x2="12" y2="40" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="68" y1="40" x2="72" y2="40" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />

            {/* Stylized Center Star / Compass Core */}
            <path
              d="M 40 28 L 42.5 37.5 L 52 40 L 42.5 42.5 L 40 52 L 37.5 42.5 L 28 40 L 37.5 37.5 Z"
              fill="url(#loadingCompassGold)"
            />

            {/* Center Core Dot */}
            <circle cx="40" cy="40" r="2.5" fill="#ffffff" />
            <circle cx="40" cy="40" r="1.2" fill="#b45309" />

            <defs>
              <linearGradient id="loadingCompassGold" x1="28" y1="28" x2="52" y2="52">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Name */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              InnerAtlas
            </h2>
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
          </div>
          <p className="text-[11px] uppercase tracking-widest font-mono text-stone-400 dark:text-stone-500">
            {subtitle || 'Personal Reflection Space'}
          </p>
        </div>

        {/* Rotating Contemplative Message */}
        <div className="mt-5 min-h-[28px] flex items-center justify-center">
          <p
            className={`text-sm sm:text-base font-serif italic text-stone-700 dark:text-stone-300 transition-all duration-250 ease-in-out ${
              fadeState === 'in'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-1'
            }`}
          >
            "{messages[currentMessageIndex]}"
          </p>
        </div>

        {/* Minimal Progress Dots */}
        <div className="flex items-center gap-1.5 mt-4" aria-hidden="true">
          {messages.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentMessageIndex
                  ? 'w-5 bg-amber-500 dark:bg-amber-400'
                  : 'w-1.5 bg-stone-300 dark:bg-stone-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
