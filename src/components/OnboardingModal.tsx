import React, { useState } from 'react';
import { Compass, Sparkles, GitMerge, Calendar, ArrowRight, Check, X, Shield } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Reflect Freely with Gemini',
      subtitle: 'A safe, quiet space to process your thoughts',
      icon: <Compass className="h-7 w-7 text-amber-500" />,
      badge: 'Private AI Partner',
      description:
        'Write raw thoughts, brainstorm ideas, or hold deep conversations with Gemini. InnerAtlas structures every reflection with empathetic listening, pattern recognition, alternative perspectives, and guiding questions.',
      highlights: [
        'Structured markdown responses with non-diagnostic inquiry',
        'Reflection focus modes (Deep Reflection, Brainstorming, Action Plan, etc.)',
        'Personal mood check-ins and AI-suggested smart tags',
      ],
    },
    {
      title: '2. Discover Memory Threads',
      subtitle: 'Connect the dots across your private entries',
      icon: <GitMerge className="h-7 w-7 text-amber-600" />,
      badge: 'Pattern Recognition',
      description:
        'As you write, InnerAtlas analyzes your private archive to identify recurring themes, goal progression, emotional patterns, and challenges over time.',
      highlights: [
        'Automatic synthesis across multiple journal entries',
        'Isolated strictly to your own authenticated user records',
        'Zero cross-user data exposure or sharing',
      ],
    },
    {
      title: '3. Understand & Grow Weekly',
      subtitle: 'Synthesize what shifted beneath the surface',
      icon: <Calendar className="h-7 w-7 text-teal-600 dark:text-teal-400" />,
      badge: 'Weekly Retrospectives',
      description:
        'Every week, explore subtle mindset shifts, celebrate personal wins, track recurring challenges, and explore a provocative question to guide the week ahead.',
      highlights: [
        'Chronological Reflection Timeline with card and timeline views',
        '7-day windowed weekly synthesis',
        'Strict per-user cloud persistence with Google Authentication',
      ],
    },
  ];

  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div
      id="modal-onboarding-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        id="modal-onboarding-content"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-2xl transition-all"
      >
        {/* Close / Skip button */}
        <button
          id="btn-skip-onboarding"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === step
                  ? 'w-8 bg-amber-600 dark:bg-amber-500'
                  : idx < step
                  ? 'w-4 bg-stone-300 dark:bg-stone-700'
                  : 'w-4 bg-stone-200 dark:bg-stone-800'
              }`}
            />
          ))}
          <span className="ml-auto text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Step {step + 1} of {steps.length}
          </span>
        </div>

        {/* Icon & Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/60">
            {current.icon}
          </div>
          <div>
            <span className="inline-block rounded-full bg-amber-100 dark:bg-amber-900/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              {current.badge}
            </span>
            <h2
              id="onboarding-title"
              className="mt-1 font-serif text-xl font-bold text-stone-900 dark:text-stone-50"
            >
              {current.title}
            </h2>
          </div>
        </div>

        <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mb-3">
          {current.subtitle}
        </p>

        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-5">
          {current.description}
        </p>

        {/* Highlights */}
        <div className="mb-6 space-y-2 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-100 dark:border-stone-800/80 p-4 text-xs">
          {current.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Privacy reassurance */}
        <div className="flex items-center gap-2 text-[11px] text-stone-400 dark:text-stone-500 mb-6">
          <Shield className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <span>Your data is strictly private and scoped to your authenticated account.</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          {step > 0 ? (
            <button
              id="btn-onboarding-back"
              onClick={() => setStep(step - 1)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              Back
            </button>
          ) : (
            <button
              id="btn-onboarding-skip-link"
              onClick={onClose}
              className="text-xs font-medium text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition"
            >
              Skip tour
            </button>
          )}

          <button
            id="btn-onboarding-next"
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-stone-900 dark:bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-stone-800 dark:hover:bg-amber-500 transition"
          >
            <span>{step === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            {step === steps.length - 1 ? (
              <Check className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
