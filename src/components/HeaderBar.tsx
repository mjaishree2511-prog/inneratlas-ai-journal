import React from 'react';
import {
  Compass,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  HelpCircle,
  Menu,
  ShieldCheck,
  User,
} from 'lucide-react';
import type { NavTabType, UserProfile, ThemeMode } from '../types';

interface HeaderBarProps {
  user: UserProfile | null;
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSetTheme?: (t: ThemeMode) => void;
  onOpenOnboarding: () => void;
  onNewEntry: () => void;
  onOpenMobileMenu: () => void;
}

const TAB_TITLES: Record<NavTabType, { title: string; subtitle: string }> = {
  home: {
    title: 'Dashboard & Home',
    subtitle: 'Daily overview, quick check-in, and recent reflections',
  },
  editor: {
    title: 'Reflect Journal',
    subtitle: 'Multi-turn AI self-inquiry with Gemini 3.6 Flash',
  },
  timeline: {
    title: 'Reflection Timeline',
    subtitle: 'Chronological archive, mood flows, and tag search',
  },
  threads: {
    title: 'Memory Threads',
    subtitle: 'Cross-entry pattern recognition and recurring themes',
  },
  weekly: {
    title: 'Weekly Insight',
    subtitle: '7-day retrospective on mindset shifts and personal wins',
  },
  profile: {
    title: 'Your Profile',
    subtitle: 'Account details and personal activity snapshot',
  },
  settings: {
    title: 'Preferences & Settings',
    subtitle: 'Theme, animations, default reflection categories, and privacy',
  },
  security: {
    title: 'Security & Threat Model',
    subtitle: 'Zero-trust Firestore rules and OWASP Top 10 countermeasures',
  },
  testing: {
    title: 'Quality Verification Suite',
    subtitle: 'Interactive test walkthrough covering every user interaction',
  },
};

export const HeaderBar: React.FC<HeaderBarProps> = ({
  user,
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  onSetTheme,
  onOpenOnboarding,
  onNewEntry,
  onOpenMobileMenu,
}) => {
  const currentInfo = TAB_TITLES[activeTab] || {
    title: 'InnerAtlas',
    subtitle: 'Private Reflections',
  };

  const handleSelectTheme = (e: React.MouseEvent, selectedTheme: ThemeMode) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSetTheme) {
      onSetTheme(selectedTheme);
    } else {
      onToggleTheme();
    }
  };

  return (
    <header
      id="app-header-bar"
      className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-900/80 px-4 sm:px-6 backdrop-blur-md transition-colors"
    >
      {/* Left side: Mobile Brand or Page Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          id="btn-mobile-menu"
          onClick={onOpenMobileMenu}
          aria-label="Open Navigation Menu"
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Compass Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="md:hidden flex items-center gap-2 cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
            InnerAtlas
          </span>
        </div>

        {/* Desktop Page Title & Subtitle */}
        <div className="hidden md:flex flex-col">
          <h1 className="font-serif text-base font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {currentInfo.title}
          </h1>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Actions, Theme Switcher, Onboarding, and Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Reflection Button on Tablet/Mobile Header */}
        <button
          type="button"
          id="btn-header-new-reflection"
          onClick={onNewEntry}
          className="md:hidden flex items-center gap-1.5 rounded-xl bg-stone-900 dark:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-stone-800 dark:hover:bg-amber-500 active:scale-95 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300 dark:text-stone-950" />
          <span>New</span>
        </button>

        {/* Segmented Theme Switcher (Single Click Immediate Activation on sm+) */}
        <div
          id="header-theme-segmented-selector"
          className="hidden sm:inline-flex items-center rounded-xl border border-stone-200/90 dark:border-stone-800 bg-stone-100/90 dark:bg-stone-800/80 p-0.5 shadow-2xs"
          role="group"
          aria-label="Theme mode selector"
        >
          <button
            type="button"
            id="btn-header-theme-light"
            onClick={(e) => handleSelectTheme(e, 'light')}
            aria-pressed={theme === 'light'}
            title="Switch to Warm Light Mode (Single Click)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              theme === 'light'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <Sun className={`h-3.5 w-3.5 ${theme === 'light' ? 'text-amber-500' : ''}`} />
            <span>Light</span>
          </button>

          <button
            type="button"
            id="btn-header-theme-dark"
            onClick={(e) => handleSelectTheme(e, 'dark')}
            aria-pressed={theme === 'dark'}
            title="Switch to Serene Dark Mode (Single Click)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              theme === 'dark'
                ? 'bg-stone-700 text-stone-50 shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <Moon className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-amber-400' : ''}`} />
            <span>Dark</span>
          </button>

          <button
            type="button"
            id="btn-header-theme-system"
            onClick={(e) => handleSelectTheme(e, 'system')}
            aria-pressed={theme === 'system'}
            title="Match System Theme (Single Click)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              theme === 'system'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Auto</span>
          </button>
        </div>

        {/* Mobile-only Single Click Theme Toggle Button */}
        <button
          type="button"
          id="btn-header-theme-toggle"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleTheme();
          }}
          title={`Switch Theme (Current: ${theme})`}
          aria-label="Toggle Light and Dark Theme"
          className="sm:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100 transition shadow-2xs active:scale-95"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-stone-700 dark:text-stone-300" />
          )}
        </button>

        {/* Guided Tour Recall Button */}
        <button
          type="button"
          id="btn-header-onboarding-tour"
          onClick={onOpenOnboarding}
          title="Guided Onboarding Tour"
          aria-label="Replay Onboarding Tour"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100 transition shadow-2xs"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Profile Avatar Trigger (takes directly to profile) */}
        {user && (
          <button
            type="button"
            id="btn-header-profile"
            onClick={() => setActiveTab('profile')}
            title={`Signed in as ${user.displayName || user.email}`}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User Avatar'}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full border border-stone-300 dark:border-stone-700 object-cover shadow-2xs"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
              </div>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
