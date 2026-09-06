import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Zap,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Lock,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import type { NavTabType, ReflectionCategory, ThemeMode, UserPreferences, UserProfile } from '../types';
import { saveUserPreferences } from '../lib/firebase';

interface SettingsViewProps {
  user: UserProfile | null;
  currentTheme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: (val: boolean) => void;
  defaultCategory: ReflectionCategory;
  onSetDefaultCategory: (cat: ReflectionCategory) => void;
  setActiveTab: (tab: NavTabType) => void;
  onOpenOnboarding: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  currentTheme,
  onSetTheme,
  reducedMotion,
  onToggleReducedMotion,
  defaultCategory,
  onSetDefaultCategory,
  setActiveTab,
  onOpenOnboarding,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleThemeChange = async (theme: ThemeMode) => {
    onSetTheme(theme);
    if (user?.uid) {
      await saveUserPreferences(user.uid, { theme });
      showFeedback();
    }
  };

  const handleMotionChange = async (val: boolean) => {
    onToggleReducedMotion(val);
    if (user?.uid) {
      await saveUserPreferences(user.uid, { reducedMotion: val });
      showFeedback();
    }
  };

  const handleCategoryChange = async (cat: ReflectionCategory) => {
    onSetDefaultCategory(cat);
    if (user?.uid) {
      await saveUserPreferences(user.uid, { defaultCategory: cat });
      showFeedback();
    }
  };

  const showFeedback = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const categories: { id: ReflectionCategory; label: string; desc: string }[] = [
    { id: 'reflection', label: 'Open Reflection', desc: 'Free-form exploratory thought' },
    { id: 'problem-solving', label: 'Problem Solving', desc: 'Overcoming roadblocks & structuring choices' },
    { id: 'gratitude', label: 'Gratitude & Appreciation', desc: 'Nurturing grounding and joy' },
    { id: 'growth', label: 'Personal Growth', desc: 'Tracking long-term habits & mindset shifts' },
    { id: 'brainstorm', label: 'Creative Brainstorming', desc: 'Expanding ideas without constraints' },
    { id: 'action-items', label: 'Action Items & Clarity', desc: 'Synthesizing next tangible steps' },
  ];

  return (
    <div id="settings-view" className="w-full max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800/80 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Preferences & Settings
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            Customize your reflection workspace, display aesthetics, and interactive features.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 animate-fade-in">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      {/* 1. Theme Configuration */}
      <section className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <Sun className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          <h2 className="font-serif text-lg font-bold">Display & Theme Mode</h2>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400">
          Select your preferred atmosphere. InnerAtlas is designed with sophisticated warm neutral tones for minimal eye fatigue.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2" role="radiogroup" aria-label="Theme mode selection">
          {/* Light Theme Button */}
          <button
            type="button"
            id="btn-theme-light"
            role="radio"
            aria-checked={currentTheme === 'light'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleThemeChange('light');
            }}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer active:scale-98 ${
              currentTheme === 'light'
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 ring-2 ring-amber-500/30'
                : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Sun className="h-5 w-5 text-amber-600" />
              {currentTheme === 'light' && (
                <CheckCircle2 className="h-4 w-4 text-amber-700" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Warm Light</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">High clarity & warmth</p>
            </div>
          </button>

          {/* Dark Theme Button */}
          <button
            type="button"
            id="btn-theme-dark"
            role="radio"
            aria-checked={currentTheme === 'dark'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleThemeChange('dark');
            }}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer active:scale-98 ${
              currentTheme === 'dark'
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 ring-2 ring-amber-500/30'
                : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Moon className="h-5 w-5 text-indigo-400" />
              {currentTheme === 'dark' && (
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Serene Dark</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Gentle night contrast</p>
            </div>
          </button>

          {/* System Theme Button */}
          <button
            type="button"
            id="btn-theme-system"
            role="radio"
            aria-checked={currentTheme === 'system'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleThemeChange('system');
            }}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer active:scale-98 ${
              currentTheme === 'system'
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 ring-2 ring-amber-500/30'
                : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Monitor className="h-5 w-5 text-stone-500" />
              {currentTheme === 'system' && (
                <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100">System Match</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Follows OS preferences</p>
            </div>
          </button>
        </div>
      </section>

      {/* 2. Motion & Accessibility */}
      <section className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <Zap className="h-5 w-5 text-teal-700 dark:text-teal-400" />
            <h2 className="font-serif text-lg font-bold">Reduced Motion & Transitions</h2>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="toggle-reduced-motion"
              checked={reducedMotion}
              onChange={(e) => handleMotionChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-teal-600"></div>
          </label>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400">
          Enable to minimize layout animations, screen shifts, and pulsing visual effects for users sensitive to motion.
        </p>
      </section>

      {/* 3. Default Reflection Category */}
      <section className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <Tag className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          <h2 className="font-serif text-lg font-bold">Default Reflection Category</h2>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400">
          Set the starting mindset category whenever you initialize a fresh reflection.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {categories.map((cat) => {
            const isSelected = defaultCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`btn-default-cat-${cat.id}`}
                onClick={() => handleCategoryChange(cat.id)}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  isSelected
                    ? 'bg-amber-50/80 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 ring-2 ring-amber-500/20'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {cat.label}
                  </p>
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                  )}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                  {cat.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Guided Tour Replay & Documentation */}
      <section className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="font-serif text-lg font-bold">Onboarding & App Architecture</h2>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400">
          Replay the guided tour to review how Gemini 3.6 Flash structured reflections, Memory Threads, and Weekly Retrospectives work.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            id="btn-settings-replay-tour"
            onClick={onOpenOnboarding}
            className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-2.5 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
          >
            Replay Guided Tour
          </button>

          <button
            id="btn-settings-threat-model"
            onClick={() => setActiveTab('security')}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/40 px-4 py-2.5 text-xs font-bold text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Review Threat Model</span>
          </button>

          <button
            id="btn-settings-walkthrough"
            onClick={() => setActiveTab('testing')}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/40 px-4 py-2.5 text-xs font-bold text-teal-900 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Interactive Verification Suite</span>
          </button>
        </div>
      </section>
    </div>
  );
};
