import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Compass, BrainCircuit } from 'lucide-react';

interface GeminiCompanionProps {
  isThinking?: boolean;
  hasNewResponse?: boolean;
  reducedMotion?: boolean;
  className?: string;
  onCompanionClick?: () => void;
}

export const GeminiCompanion: React.FC<GeminiCompanionProps> = ({
  isThinking = false,
  hasNewResponse = false,
  reducedMotion = false,
  className = '',
  onCompanionClick,
}) => {
  const [reactionActive, setReactionActive] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string | null>(null);
  const [thinkingIndex, setThinkingIndex] = useState(0);

  const THINKING_MESSAGES = [
    'Thinking...',
    'Reflecting on that...',
    'Connecting a few thoughts...',
    'Looking for patterns...',
  ];

  // Rotate thinking messages when Gemini is actively synthesizing
  useEffect(() => {
    if (!isThinking) {
      setThinkingIndex(0);
      return;
    }

    setSpeechBubbleText(THINKING_MESSAGES[0]);
    const interval = setInterval(() => {
      setThinkingIndex((prev) => {
        const next = (prev + 1) % THINKING_MESSAGES.length;
        setSpeechBubbleText(THINKING_MESSAGES[next]);
        return next;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isThinking]);

  // Trigger celebration reaction when response becomes ready
  useEffect(() => {
    if (hasNewResponse && !isThinking) {
      setReactionActive(true);
      setSpeechBubbleText('Here is what I noticed ✨');
      const timer = setTimeout(() => {
        setReactionActive(false);
        setSpeechBubbleText(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [hasNewResponse, isThinking]);

  // Reset bubble when neither thinking nor reaction active
  useEffect(() => {
    if (!isThinking && !reactionActive) {
      setSpeechBubbleText(null);
    }
  }, [isThinking, reactionActive]);

  const handleCompanionTap = () => {
    if (isThinking) return;
    if (onCompanionClick) {
      onCompanionClick();
    } else {
      const prompts = [
        'Take your time. What feeling is most present?',
        'I am listening. Unpack whatever is on your mind.',
        'Every thought you record helps uncover clarity.',
        'You can reflect freely without judgment here.',
      ];
      const randomTip = prompts[Math.floor(Math.random() * prompts.length)];
      setSpeechBubbleText(randomTip);
      setReactionActive(true);
      setTimeout(() => {
        setSpeechBubbleText(null);
        setReactionActive(false);
      }, 4000);
    }
  };

  return (
    <div
      id="gemini-companion-container"
      className={`relative inline-flex items-center gap-2.5 select-none ${className}`}
      role="status"
      aria-live="polite"
      aria-label={
        isThinking
          ? 'Atlas is contemplating your reflection'
          : reactionActive
          ? 'Atlas synthesized your reflection'
          : 'Atlas, your AI reflection companion'
      }
    >
      {/* Speech / State Bubble */}
      {speechBubbleText && (
        <div
          id="companion-speech-bubble"
          className={`px-3 py-1.5 rounded-2xl text-xs font-medium border shadow-xs transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isThinking
              ? 'bg-amber-50/95 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
              : 'bg-white/95 dark:bg-stone-800/95 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {isThinking ? (
              <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400 animate-spin" />
            ) : (
              <Compass className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            )}
            <span className="whitespace-nowrap max-w-[150px] sm:max-w-[220px] truncate">{speechBubbleText}</span>
          </div>
        </div>
      )}

      {/* Companion Bot Body Button */}
      <button
        type="button"
        id="btn-gemini-companion"
        onClick={handleCompanionTap}
        title="Atlas: InnerAtlas AI Companion"
        aria-label="Atlas AI Companion (Click for an inspiring prompt)"
        className={`relative group flex items-center justify-center h-10 w-10 rounded-2xl transition cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 ${
          !reducedMotion && !isThinking ? 'animate-companion-float' : ''
        }`}
      >
        {/* Ambient Halo Glow */}
        <div
          className={`absolute -inset-1 rounded-2xl transition-all duration-500 ${
            isThinking
              ? 'bg-amber-400/30 dark:bg-amber-500/25 blur-sm scale-110'
              : reactionActive
              ? 'bg-emerald-400/30 dark:bg-emerald-500/25 blur-sm scale-105'
              : 'bg-stone-300/20 dark:bg-amber-500/10 blur-xs group-hover:scale-105'
          }`}
        />

        {/* Orbit Ring (rotates when thinking) */}
        <div
          className={`absolute inset-0 rounded-2xl border border-dashed transition-all duration-700 pointer-events-none ${
            isThinking
              ? 'border-amber-500/60 dark:border-amber-400/60 animate-companion-orbit'
              : reactionActive
              ? 'border-emerald-500/50 dark:border-emerald-400/50'
              : 'border-stone-300/40 dark:border-stone-700/60'
          }`}
        />

        {/* Bot Shell */}
        <div
          className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-xl border shadow-xs transition-all duration-300 ${
            isThinking
              ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 dark:border-amber-600 scale-105'
              : reactionActive
              ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-400 dark:border-emerald-600'
              : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 group-hover:border-amber-400 dark:group-hover:border-amber-600'
          }`}
        >
          {/* Antenna / Star Sparkle */}
          <div className="absolute -top-1.5 flex flex-col items-center">
            <span
              className={`block h-1 w-1 rounded-full transition-colors ${
                isThinking
                  ? 'bg-amber-500 animate-ping'
                  : reactionActive
                  ? 'bg-emerald-400'
                  : 'bg-amber-600 dark:bg-amber-400'
              }`}
            />
          </div>

          {/* Bot Face SVG */}
          <svg
            className="w-5 h-5 text-stone-800 dark:text-stone-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Screen / Visor Outline */}
            <rect x="3" y="6" width="18" height="12" rx="4" fill="currentColor" fillOpacity="0.08" />

            {/* Eyes based on state */}
            {isThinking ? (
              // Thinking Eyes (pulsing wave / circles)
              <>
                <circle cx="8.5" cy="12" r="1.5" fill="currentColor" className="animate-pulse" />
                <circle cx="15.5" cy="12" r="1.5" fill="currentColor" className="animate-pulse" />
              </>
            ) : reactionActive ? (
              // Happy Expressive Eyes (^ ^)
              <>
                <path d="M7 13c.8-1.2 2-1.2 2.8 0" strokeWidth="2.2" stroke="currentColor" fill="none" />
                <path d="M14.2 13c.8-1.2 2-1.2 2.8 0" strokeWidth="2.2" stroke="currentColor" fill="none" />
              </>
            ) : (
              // Normal Gentle Eyes with occasional blink animation
              <g className={!reducedMotion ? 'animate-companion-blink' : ''}>
                <ellipse cx="8.5" cy="12" rx="1.4" ry="1.6" fill="currentColor" />
                <ellipse cx="15.5" cy="12" rx="1.4" ry="1.6" fill="currentColor" />
              </g>
            )}

            {/* Subtle Friendly Smile */}
            {reactionActive ? (
              <path d="M10 15.5c.8.6 3.2.6 4 0" stroke="currentColor" strokeWidth="1.8" />
            ) : (
              <path d="M10.5 15c.6.3 2.4.3 3 0" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
            )}
          </svg>
        </div>
      </button>
    </div>
  );
};
