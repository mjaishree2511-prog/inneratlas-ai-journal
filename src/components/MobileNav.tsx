import React from 'react';
import {
  LayoutDashboard,
  PenLine,
  BookOpen,
  GitMerge,
  CalendarCheck,
  User,
  Settings,
  ShieldCheck,
  PlayCircle,
  LogOut,
  X,
  Compass,
} from 'lucide-react';
import type { NavTabType, UserProfile } from '../types';

interface MobileNavProps {
  user: UserProfile | null;
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNewEntry: () => void;
  entriesCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  user,
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onLogout,
  onNewEntry,
  entriesCount,
}) => {
  const bottomTabs: {
    id: NavTabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'editor', label: 'Reflect', icon: PenLine },
    { id: 'timeline', label: 'Timeline', icon: BookOpen },
    { id: 'threads', label: 'Threads', icon: GitMerge },
    { id: 'weekly', label: 'Weekly', icon: CalendarCheck },
  ];

  const drawerLinks: {
    id: NavTabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    category?: string;
  }[] = [
    { id: 'home', label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'editor', label: 'Reflect Journal', icon: PenLine },
    { id: 'timeline', label: `Timeline (${entriesCount})`, icon: BookOpen },
    { id: 'threads', label: 'Memory Threads', icon: GitMerge },
    { id: 'weekly', label: 'Weekly Insight', icon: CalendarCheck },
    { id: 'profile', label: 'Your Profile', icon: User, category: 'Account' },
    { id: 'settings', label: 'Preferences & Settings', icon: Settings, category: 'Account' },
    { id: 'security', label: 'Threat Model & Security', icon: ShieldCheck, category: 'Quality & QA' },
    { id: 'testing', label: 'Verification Suite', icon: PlayCircle, category: 'Quality & QA' },
  ];

  const handleSelectTab = (tab: NavTabType) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* 1. Mobile Bottom Tab Bar (Always visible on mobile) */}
      <nav
        id="mobile-bottom-nav"
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-stone-200/90 dark:border-stone-800/90 bg-white/95 dark:bg-stone-900/95 px-2 backdrop-blur-lg shadow-lg safe-area-bottom"
      >
        {bottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-2xl transition ${
                isActive
                  ? 'text-amber-900 dark:text-amber-300 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-xl transition ${
                  isActive
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300'
                    : ''
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 2. Slide-out Drawer Overlay for More/Menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex bg-stone-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        >
          <div
            className="w-4/5 max-w-sm h-full bg-white dark:bg-stone-900 shadow-2xl p-5 flex flex-col justify-between overflow-y-auto transition-transform duration-300 border-r border-stone-200 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-900 dark:text-amber-300 border border-amber-500/20">
                    <Compass className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      InnerAtlas
                    </h2>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">
                      Navigation & Account
                    </p>
                  </div>
                </div>

                <button
                  id="btn-close-mobile-drawer"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Identity Snapshot */}
              {user && (
                <div
                  onClick={() => handleSelectTab('profile')}
                  className="mb-5 flex items-center gap-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 p-3.5 border border-amber-200/80 dark:border-amber-800/60 cursor-pointer shadow-2xs"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User Avatar'}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full border border-amber-300 dark:border-amber-700 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-300 font-bold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                      {user.displayName || 'Reflective Soul'}
                    </p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-0.5 text-[9px] font-semibold text-amber-800 dark:text-amber-300">
                      View Profile →
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation list */}
              <div className="space-y-1">
                {drawerLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activeTab === link.id;
                  return (
                    <button
                      key={link.id}
                      id={`drawer-link-${link.id}`}
                      onClick={() => handleSelectTab(link.id)}
                      className={`flex items-center gap-3 w-full rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition text-left ${
                        isActive
                          ? 'bg-amber-100/70 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-stone-500 dark:text-stone-400" />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
              <button
                id="btn-mobile-new-entry"
                onClick={() => {
                  onNewEntry();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-stone-800 dark:hover:bg-amber-500 transition"
              >
                <PenLine className="h-4 w-4" />
                <span>Start New Reflection</span>
              </button>

              <button
                id="btn-mobile-logout"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/80 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
