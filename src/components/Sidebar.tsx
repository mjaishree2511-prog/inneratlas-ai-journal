import React from 'react';
import {
  Compass,
  LayoutDashboard,
  PenLine,
  BookOpen,
  GitMerge,
  CalendarCheck,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import type { NavTabType, UserProfile } from '../types';

interface SidebarProps {
  user: UserProfile | null;
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  onNewEntry: () => void;
  onLogout: () => void;
  entriesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onNewEntry,
  onLogout,
  entriesCount,
}) => {
  const navItems: {
    id: NavTabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    description: string;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: LayoutDashboard,
      description: 'Daily overview & snapshot',
    },
    {
      id: 'editor',
      label: 'Reflect',
      icon: PenLine,
      description: 'Active reflection journal',
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: BookOpen,
      badge: entriesCount > 0 ? entriesCount : undefined,
      description: 'Past entries & search',
    },
    {
      id: 'threads',
      label: 'Memory Threads',
      icon: GitMerge,
      description: 'Thematic pattern discovery',
    },
    {
      id: 'weekly',
      label: 'Weekly Insight',
      icon: CalendarCheck,
      description: '7-day retrospective',
    },
  ];

  const secondaryItems: {
    id: NavTabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }[] = [
    {
      id: 'security',
      label: 'Security Model',
      icon: ShieldCheck,
      description: 'OWASP & Threat Matrix',
    },
    {
      id: 'testing',
      label: 'Verification Suite',
      icon: PlayCircle,
      description: 'Quality walkthroughs',
    },
  ];

  return (
    <aside
      id="sidebar-navigation"
      aria-label="Main Navigation"
      className={`hidden md:flex flex-col justify-between border-r border-stone-200/80 dark:border-stone-800/80 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md transition-all duration-300 ease-in-out shrink-0 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand & Header */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800/60 min-h-[4.25rem]">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden"
            title="InnerAtlas Home"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-900 dark:text-amber-300 border border-amber-500/20 dark:border-amber-400/20 transition group-hover:scale-105 shadow-xs">
              <Compass className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="font-serif text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 truncate">
                  InnerAtlas
                </span>
                <span className="text-[10px] font-medium tracking-wide text-amber-800/80 dark:text-amber-400/80 uppercase">
                  Private Reflections
                </span>
              </div>
            )}
          </div>

          <button
            id="btn-toggle-sidebar"
            onClick={() => setIsCollapsed((prev) => !prev)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Quick New Reflection Action Button */}
        <div className="p-3">
          <button
            id="btn-sidebar-new-reflection"
            onClick={onNewEntry}
            title="Start New Reflection"
            className={`w-full flex items-center justify-center gap-2.5 rounded-2xl bg-stone-900 dark:bg-amber-600 text-white font-semibold text-xs py-3 px-3 shadow-xs hover:bg-stone-800 dark:hover:bg-amber-500 active:scale-[0.98] transition ${
              isCollapsed ? 'px-0' : ''
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-300 dark:text-stone-950 shrink-0" />
            {!isCollapsed && <span>New Reflection</span>}
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex flex-col gap-1 px-3 py-2" aria-label="Core Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? `${item.label} (${item.description})` : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center gap-3 w-full rounded-2xl px-3 py-2.5 text-xs font-semibold transition text-left relative ${
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/60 shadow-2xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100/80 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-100 border border-transparent'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
                    isActive
                      ? 'bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300'
                      : 'text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <div className="flex flex-col truncate">
                      <span className="truncate">{item.label}</span>
                      <span className="text-[10px] font-normal text-stone-400 dark:text-stone-500 truncate">
                        {item.description}
                      </span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="ml-2 rounded-full bg-stone-200/80 dark:bg-stone-800 px-2 py-0.5 text-[10px] font-mono text-stone-700 dark:text-stone-300 font-bold shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Collapsed Tooltip Indicator */}
                {isCollapsed && isActive && (
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-amber-600 dark:bg-amber-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Secondary Navigation (Security & QA) */}
        {!isCollapsed && (
          <div className="px-5 pt-3 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              System & QA
            </span>
          </div>
        )}
        <div className="flex flex-col gap-1 px-3 py-1">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? `${item.label} (${item.description})` : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center gap-3 w-full rounded-2xl px-3 py-2 text-xs transition text-left relative ${
                  isActive
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold border border-stone-200 dark:border-stone-700'
                    : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/40 hover:text-stone-800 dark:hover:text-stone-200 border border-transparent'
                }`}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-stone-500 dark:text-stone-400">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col truncate">
                    <span className="truncate">{item.label}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom User Profile, Settings, and Logout Section */}
      <div className="p-3 border-t border-stone-200/80 dark:border-stone-800/80 flex flex-col gap-1 bg-stone-50/50 dark:bg-stone-950/40">
        {/* Profile Button */}
        <button
          id="nav-item-profile"
          onClick={() => setActiveTab('profile')}
          title={isCollapsed ? 'Your Profile' : undefined}
          className={`flex items-center gap-3 w-full rounded-2xl p-2 text-xs font-semibold transition text-left ${
            activeTab === 'profile'
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 border border-transparent'
          }`}
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User Avatar'}
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full border border-stone-300 dark:border-stone-700 object-cover shrink-0"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
          )}

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 truncate">
              <span className="font-semibold text-stone-900 dark:text-stone-100 truncate text-xs">
                {user?.displayName || 'Reflective Soul'}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                {user?.email || 'Authenticated User'}
              </span>
            </div>
          )}
        </button>

        {/* Settings Button */}
        <button
          id="nav-item-settings"
          onClick={() => setActiveTab('settings')}
          title={isCollapsed ? 'Settings' : undefined}
          className={`flex items-center gap-3 w-full rounded-2xl px-3 py-2 text-xs font-semibold transition text-left ${
            activeTab === 'settings'
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-100 border border-transparent'
          }`}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
            <Settings className="h-4 w-4 text-stone-500 dark:text-stone-400" />
          </div>
          {!isCollapsed && <span>Settings</span>}
        </button>

        {/* Sign Out Button */}
        <button
          id="nav-item-logout"
          onClick={onLogout}
          title={isCollapsed ? 'Sign Out' : undefined}
          className="flex items-center gap-3 w-full rounded-2xl px-3 py-2 text-xs font-semibold text-stone-500 hover:text-red-700 dark:text-stone-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition text-left border border-transparent"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
            <LogOut className="h-4 w-4" />
          </div>
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
