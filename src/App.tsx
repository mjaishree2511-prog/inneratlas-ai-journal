import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  logOut,
  saveJournalEntryToFirestore,
  loadUserJournalEntries,
  deleteJournalEntryFromFirestore,
  loadUserPreferences,
  saveUserPreferences,
} from './lib/firebase';
import type {
  UserProfile,
  JournalEntry,
  NavTabType,
  MoodType,
  ReflectionCategory,
  ThemeMode,
} from './types';
import { Sidebar } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { MobileNav } from './components/MobileNav';
import { HomeDashboard } from './components/HomeDashboard';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { LandingPage } from './components/LandingPage';
import { JournalEditor } from './components/JournalEditor';
import { HistoryList } from './components/HistoryList';
import { MemoryThreadsView } from './components/MemoryThreadsView';
import { WeeklyInsightView } from './components/WeeklyInsightView';
import { ThreatModelView } from './components/ThreatModelView';
import { TestingWalkthroughView } from './components/TestingWalkthroughView';
import { OnboardingModal } from './components/OnboardingModal';
import { InnerAtlasLoading } from './components/InnerAtlasLoading';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTabType>('home');

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // Sidebar & Responsive State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('inneratlas_sidebar_collapsed') === 'true';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User Preferences State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('inneratlas_theme') as ThemeMode;
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    return 'system';
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('inneratlas_reduced_motion') === 'true';
  });
  const [defaultCategory, setDefaultCategory] = useState<ReflectionCategory>('reflection');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Handle Sidebar collapse toggle
  const handleToggleSidebar = (collapsed: boolean | ((prev: boolean) => boolean)) => {
    setIsSidebarCollapsed((prev) => {
      const next = typeof collapsed === 'function' ? collapsed(prev) : collapsed;
      localStorage.setItem('inneratlas_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Immediate DOM theme application helper
  const applyThemeToDOM = (selectedTheme: ThemeMode) => {
    let isDark = false;
    if (selectedTheme === 'dark') {
      isDark = true;
    } else if (selectedTheme === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync theme class to document root and handle system changes
  useEffect(() => {
    applyThemeToDOM(theme);
    localStorage.setItem('inneratlas_theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyThemeToDOM('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Reduced motion preference
  useEffect(() => {
    localStorage.setItem('inneratlas_reduced_motion', String(reducedMotion));
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  // Helper to generate a new empty entry
  const createNewEmptyEntry = (
    userId: string,
    initialMood?: MoodType,
    initialCategory?: ReflectionCategory
  ): JournalEntry => ({
    id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    userId,
    title: initialMood ? `Reflection (${initialMood})` : 'New Reflection',
    category: initialCategory || defaultCategory || 'reflection',
    messages: [],
    mood: initialMood,
    tags: initialMood ? [initialMood.toLowerCase()] : [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(profile);

        // Load user preferences (theme, onboarding, default category)
        try {
          const prefs = await loadUserPreferences(firebaseUser.uid);
          if (prefs.theme) {
            setTheme(prefs.theme);
          }
          if (prefs.reducedMotion !== undefined) {
            setReducedMotion(prefs.reducedMotion);
          }
          if (prefs.defaultCategory) {
            setDefaultCategory(prefs.defaultCategory);
          }
          if (
            prefs.completedOnboarding === false ||
            (!prefs.completedOnboarding && !localStorage.getItem(`onboarded_${firebaseUser.uid}`))
          ) {
            setShowOnboarding(true);
          }
        } catch (e) {
          console.error('Error loading preferences:', e);
        }

        // Load existing entries for this user
        try {
          const userEntries = await loadUserJournalEntries(firebaseUser.uid);
          setEntries(userEntries);
          if (userEntries.length > 0) {
            setCurrentEntry(userEntries[0]);
          } else {
            setCurrentEntry(createNewEmptyEntry(firebaseUser.uid));
            if (!localStorage.getItem(`onboarded_${firebaseUser.uid}`)) {
              setShowOnboarding(true);
            }
          }
        } catch (err) {
          console.error('Failed to load user entries:', err);
          setCurrentEntry(createNewEmptyEntry(firebaseUser.uid));
        }

        // Ensure user lands on Home dashboard after sign-in
        setActiveTab('home');
      } else {
        setUser(null);
        setEntries([]);
        setCurrentEntry(null);
        setShowOnboarding(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    if (user) {
      localStorage.setItem(`onboarded_${user.uid}`, 'true');
      saveUserPreferences(user.uid, { completedOnboarding: true });
    }
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    if (user) {
      localStorage.setItem(`onboarded_${user.uid}`, 'true');
      saveUserPreferences(user.uid, { completedOnboarding: true });
    }
  };

  // Handle Google Sign-in
  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  // Handle Logout
  const handleLogout = async () => {
    await logOut();
    setActiveTab('home');
  };

  // Start a new reflection (with optional mood/category)
  const handleNewEntry = (mood?: MoodType, category?: ReflectionCategory) => {
    if (!user) return;
    const newEntry = createNewEmptyEntry(user.uid, mood, category);
    setCurrentEntry(newEntry);
    setActiveTab('editor');
  };

  // Select an entry from history / timeline / recent
  const handleSelectEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setActiveTab('editor');
  };

  // Select an entry by title (from Memory Threads)
  const handleSelectEntryByTitle = (title: string) => {
    const matched = entries.find(
      (e) => e.title.toLowerCase().trim() === title.toLowerCase().trim()
    );
    if (matched) {
      setCurrentEntry(matched);
      setActiveTab('editor');
    } else {
      const fuzzyMatched = entries.find((e) =>
        e.title.toLowerCase().includes(title.toLowerCase())
      );
      if (fuzzyMatched) {
        setCurrentEntry(fuzzyMatched);
        setActiveTab('editor');
      }
    }
  };

  // Save/Update entry in Firestore
  const handleUpdateEntry = useCallback(
    async (updatedEntry: JournalEntry) => {
      if (!user) return;

      // Update local state immediately
      setCurrentEntry(updatedEntry);
      setEntries((prev) => {
        const exists = prev.some((e) => e.id === updatedEntry.id);
        if (exists) {
          return prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e));
        }
        return [updatedEntry, ...prev];
      });

      // Synchronize to Firestore
      try {
        setIsSaving(true);
        setSaveError(null);
        await saveJournalEntryToFirestore(user.uid, updatedEntry);
        setLastSavedAt(Date.now());
      } catch (err: any) {
        console.error('Firestore save failed:', err);
        setSaveError(err.message || 'Failed to save to Firestore.');
      } finally {
        setIsSaving(false);
      }
    },
    [user]
  );

  // Delete entry
  const handleDeleteEntry = async (entryId: string) => {
    if (!user) return;
    try {
      await deleteJournalEntryFromFirestore(user.uid, entryId);
      const remaining = entries.filter((e) => e.id !== entryId);
      setEntries(remaining);

      if (currentEntry?.id === entryId) {
        if (remaining.length > 0) {
          setCurrentEntry(remaining[0]);
        } else {
          setCurrentEntry(createNewEmptyEntry(user.uid));
        }
      }
    } catch (err: any) {
      console.error('Failed to delete entry:', err);
      alert('Could not delete entry: ' + (err.message || 'Unknown error'));
    }
  };

  // Retry save
  const handleRetrySave = () => {
    if (currentEntry && user) {
      handleUpdateEntry(currentEntry);
    }
  };

  // Immediate Single-Click Theme Setter (updates DOM, state, storage, and cloud instantly)
  const handleSetTheme = useCallback(
    (newTheme: ThemeMode) => {
      setTheme(newTheme);
      localStorage.setItem('inneratlas_theme', newTheme);
      applyThemeToDOM(newTheme);
      if (user?.uid) {
        saveUserPreferences(user.uid, { theme: newTheme }).catch((err) => {
          console.warn('Could not save theme preference:', err);
        });
      }
    },
    [user]
  );

  // Single-click Theme Toggle (immediately flips visible light <-> dark)
  const handleToggleTheme = useCallback(() => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    // If currently dark, single click switches to light immediately.
    // If currently light, single click switches to dark immediately.
    const nextTheme: ThemeMode = isCurrentlyDark ? 'light' : 'dark';
    handleSetTheme(nextTheme);
  }, [handleSetTheme]);

  if (isAuthLoading) {
    return <InnerAtlasLoading subtitle="Initializing Secure Reflection Workspace" />;
  }

  // If user is not authenticated, show the authentication landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans antialiased">
        <LandingPage onSignIn={handleSignIn} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans antialiased selection:bg-amber-200 dark:selection:bg-amber-900 selection:text-amber-900 dark:selection:text-amber-100 transition-colors">
      {/* 1. Desktop Persistent Sidebar */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={handleToggleSidebar}
        onNewEntry={() => handleNewEntry()}
        onLogout={handleLogout}
        entriesCount={entries.length}
      />

      {/* 2. Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <HeaderBar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onSetTheme={handleSetTheme}
          onOpenOnboarding={() => setShowOnboarding(true)}
          onNewEntry={() => handleNewEntry()}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Scrollable Main Application Content Area */}
        <main
          id="main-app-content"
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 md:pb-12 pb-24"
        >
          <div key={activeTab} className="transition-opacity duration-200 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
            {/* Home Dashboard */}
            {activeTab === 'home' && (
            <HomeDashboard
              user={user}
              entries={entries}
              setActiveTab={setActiveTab}
              onSelectEntry={handleSelectEntry}
              onNewEntryWithMood={(mood) => handleNewEntry(mood)}
            />
          )}

          {/* Journal Editor / Active Reflection */}
          {activeTab === 'editor' && currentEntry && (
            <JournalEditor
              entry={currentEntry}
              onUpdateEntry={handleUpdateEntry}
              onDeleteEntry={handleDeleteEntry}
              isSaving={isSaving}
              saveError={saveError}
              lastSavedAt={lastSavedAt}
              onRetrySave={handleRetrySave}
            />
          )}

          {/* Chronological Timeline */}
          {activeTab === 'timeline' && (
            <HistoryList
              entries={entries}
              onSelectEntry={handleSelectEntry}
              onDeleteEntry={handleDeleteEntry}
              onNewEntry={() => handleNewEntry()}
            />
          )}

          {/* Memory Threads Pattern Discovery */}
          {activeTab === 'threads' && (
            <MemoryThreadsView
              entries={entries}
              onSelectEntryByTitle={handleSelectEntryByTitle}
              onNewEntry={() => handleNewEntry()}
            />
          )}

          {/* Weekly 7-Day Retrospective */}
          {activeTab === 'weekly' && (
            <WeeklyInsightView
              entries={entries}
              onNewEntry={() => handleNewEntry()}
              onOpenTimeline={() => setActiveTab('timeline')}
            />
          )}

          {/* Profile View */}
          {activeTab === 'profile' && (
            <ProfileView
              user={user}
              entries={entries}
              setActiveTab={setActiveTab}
              onLogout={handleLogout}
            />
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <SettingsView
              user={user}
              currentTheme={theme}
              onSetTheme={handleSetTheme}
              reducedMotion={reducedMotion}
              onToggleReducedMotion={(m) => setReducedMotion(m)}
              defaultCategory={defaultCategory}
              onSetDefaultCategory={(c) => setDefaultCategory(c)}
              setActiveTab={setActiveTab}
              onOpenOnboarding={() => setShowOnboarding(true)}
            />
          )}

          {/* Threat Model & Security */}
          {activeTab === 'security' && <ThreatModelView />}

          {/* Testing Walkthrough Suite */}
          {activeTab === 'testing' && <TestingWalkthroughView />}
        </div>
      </main>
      </div>

      {/* 3. Mobile Navigation & Slide-over Drawer */}
      <MobileNav
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
        onNewEntry={() => handleNewEntry()}
        entriesCount={entries.length}
      />

      {/* 4. Onboarding Guided Tour Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
        onComplete={handleCompleteOnboarding}
      />
    </div>
  );
}
