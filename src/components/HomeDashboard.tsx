import React, { useState } from 'react';
import {
  Sparkles,
  PenLine,
  BookOpen,
  GitMerge,
  CalendarCheck,
  Smile,
  Compass,
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  CheckCircle2,
  Calendar,
  Palette,
} from 'lucide-react';
import type { JournalEntry, MoodType, NavTabType, UserProfile } from '../types';
import { ColorJourneyView } from './ColorJourneyView';
import { CelestialCompassHeroVisual, EmptyJournalIllustration } from './CelestialCompassVisual';

interface HomeDashboardProps {
  user: UserProfile | null;
  entries: JournalEntry[];
  setActiveTab: (tab: NavTabType) => void;
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntryWithMood?: (mood?: MoodType) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  entries,
  setActiveTab,
  onSelectEntry,
  onNewEntryWithMood,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(() => {
    if (entries.length > 0) {
      const today = new Date().toDateString();
      const latestEntry = entries[0];
      const entryDate = new Date(latestEntry.createdAt).toDateString();
      if (entryDate === today && latestEntry.mood) {
        return latestEntry.mood;
      }
    }
    return null;
  });

  const [checkInSubmitted, setCheckInSubmitted] = useState<boolean>(false);

  // Time-based natural greeting with celestial emoji
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.displayName ? user.displayName.split(' ')[0] : 'there';
    if (hour < 12) return { text: `Good morning, ${name}`, emoji: '☀️' };
    if (hour < 18) return { text: `Good afternoon, ${name}`, emoji: '🌤️' };
    return { text: `Good evening, ${name}`, emoji: '🌙' };
  };

  const greeting = getGreeting();

  // 7-day Weekly Mood Overview
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const dayNum = d.getDate();
    const dayEntry = entries.find((e) => new Date(e.createdAt).toDateString() === dateStr);
    return {
      date: d,
      dateStr,
      dayName,
      dayNum,
      entry: dayEntry,
      mood: dayEntry?.mood,
      isToday: i === 6,
    };
  });

  // Compute personal stats from real Firestore entries
  const totalEntries = entries.length;

  // Active days in last 30 days
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentEntries = entries.filter((e) => e.createdAt >= thirtyDaysAgo);
  const activeDatesSet = new Set(
    recentEntries.map((e) => new Date(e.createdAt).toDateString())
  );
  const activeDaysCount = activeDatesSet.size;

  // Mood frequency
  const moodCounts = entries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Calm';

  // Category breakdown
  const categoryCounts = entries.reduce((acc, entry) => {
    if (entry.category) {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'reflection';

  // Most recent reflection
  const latestEntry = entries.length > 0 ? entries[0] : null;

  // Mood options configuration
  const moods: { label: MoodType; emoji: string; color: string; desc: string }[] = [
    { label: 'Great', emoji: '🌟', color: 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800', desc: 'Energized & joyful' },
    { label: 'Calm', emoji: '🌿', color: 'bg-teal-50 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800', desc: 'Centered & peaceful' },
    { label: 'Neutral', emoji: '⚖️', color: 'bg-stone-100 text-stone-900 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700', desc: 'Steady & present' },
    { label: 'Stressed', emoji: '⚡', color: 'bg-amber-50 text-amber-950 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800', desc: 'Overwhelmed or tense' },
    { label: 'Sad', emoji: '🌧️', color: 'bg-indigo-50 text-indigo-950 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800', desc: 'Low energy or reflective' },
  ];

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setCheckInSubmitted(true);
    if (onNewEntryWithMood) {
      // Allow user to directly begin a reflection with this mood preselected
      onNewEntryWithMood(mood);
    } else {
      setActiveTab('editor');
    }
  };

  const getMoodBadgeStyle = (mood?: string) => {
    switch (mood) {
      case 'Great':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
      case 'Calm':
        return 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800';
      case 'Stressed':
        return 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
      case 'Sad':
        return 'bg-indigo-100 text-indigo-950 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
    }
  };

  return (
    <div id="home-dashboard-view" className="w-full max-w-6xl mx-auto space-y-8 pb-16">
      {/* 1. Welcoming Hero Section with Celestial Compass Artwork */}
      <section
        id="hero-welcoming-section"
        className="relative overflow-hidden rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-gradient-to-br from-white via-amber-50/40 to-stone-100/60 dark:from-stone-900/95 dark:via-stone-900/90 dark:to-stone-950 p-6 sm:p-8 md:p-10 shadow-sm"
      >
        {/* Ambient Decorative Shapes */}
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-teal-400/10 dark:bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Greeting, Contemplation, and Quick Start */}
          <div className="lg:col-span-8 space-y-5">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 dark:bg-amber-950/90 px-3 py-1 text-xs font-bold text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/80 shadow-2xs">
                <Compass className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                <span>Inner Sanctuary</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-stone-800/80 px-2.5 py-1 text-[11px] font-mono text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 text-[11px] font-medium text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                ✨ Zero-Trust Encrypted
              </span>
            </div>

            {/* Main Greeting Headline */}
            <div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight flex items-center gap-2.5">
                <span>{greeting.text}</span>
                <span className="text-2xl sm:text-3xl select-none" role="img" aria-label="time indicator">{greeting.emoji}</span>
              </h1>
              <p className="text-base sm:text-lg font-serif italic text-amber-900/90 dark:text-amber-200/90 mt-2 font-medium">
                "How are you feeling beneath the surface today?"
              </p>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl leading-relaxed">
                Welcome to your inner atlas. Here, your thoughts turn into structured clarity, emotions reveal recurring patterns, and small moments become lifelong milestones.
              </p>
            </div>

            {/* Thought of the Day / Contemplation Banner */}
            <div className="rounded-2xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40 p-4 transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    Mindful Thought for Today
                  </p>
                  <p className="text-xs sm:text-sm font-serif italic text-stone-800 dark:text-stone-200 mt-0.5">
                    "What is one quiet truth you’ve been holding softly today?"
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="btn-hero-reflect-prompt"
                onClick={() => {
                  if (onNewEntryWithMood) onNewEntryWithMood();
                  setActiveTab('editor');
                }}
                className="self-end sm:self-center shrink-0 rounded-xl bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-400 text-white dark:text-stone-950 px-3.5 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Reflect on this →
              </button>
            </div>

            {/* Quick Actions & Mini Stats Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                id="btn-home-start-reflecting-hero"
                onClick={() => {
                  if (onNewEntryWithMood) onNewEntryWithMood();
                  setActiveTab('editor');
                }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-500 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <PenLine className="h-4 w-4 text-amber-300 dark:text-stone-950" />
                <span>Start reflecting</span>
              </button>

              <button
                type="button"
                id="btn-home-explore-timeline"
                onClick={() => setActiveTab('timeline')}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/90 dark:bg-stone-800/80 px-4 py-3 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5 text-stone-400" />
                <span>Timeline ({totalEntries})</span>
              </button>

              <button
                type="button"
                id="btn-home-memory-threads"
                onClick={() => setActiveTab('threads')}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/90 dark:bg-stone-800/80 px-4 py-3 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition cursor-pointer"
              >
                <GitMerge className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Memory Threads</span>
              </button>

              <button
                type="button"
                id="btn-home-weekly-insight"
                onClick={() => setActiveTab('weekly')}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/90 dark:bg-stone-800/80 px-4 py-3 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition cursor-pointer"
              >
                <CalendarCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Weekly Insight</span>
              </button>
            </div>
          </div>

          {/* Right Column: Abstract Celestial Mind-Compass Artwork */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <CelestialCompassHeroVisual size={250} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 mt-2">
              InnerAtlas Compass • Reflection Node
            </span>
          </div>
        </div>
      </section>

      {/* 2. Small Weekly Mood Overview */}
      <section
        id="section-weekly-mood-overview"
        className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-5 sm:p-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Smile className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                Weekly Mood Landscape
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Your past 7 days of emotional rhythm & mindsets
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500">
              {past7Days.filter((d) => d.mood).length} of 7 days logged
            </span>
            <button
              onClick={() => setActiveTab('weekly')}
              className="text-[11px] font-bold text-amber-800 dark:text-amber-400 hover:underline"
            >
              View Full Retrospective →
            </button>
          </div>
        </div>

        {/* 7-day pill row */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {past7Days.map((day, idx) => {
            const moodConfig = day.mood ? moods.find((m) => m.label === day.mood) : null;
            return (
              <div
                key={idx}
                id={`weekly-day-slot-${idx}`}
                onClick={() => {
                  if (day.entry) {
                    onSelectEntry(day.entry);
                    setActiveTab('editor');
                  } else {
                    if (onNewEntryWithMood) onNewEntryWithMood();
                    setActiveTab('editor');
                  }
                }}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition cursor-pointer group ${
                  day.isToday
                    ? 'border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 shadow-2xs'
                    : 'border-stone-200/70 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title={day.mood ? `${day.dayName}: ${day.mood} - Click to view` : `${day.dayName}: No entry yet - Click to reflect`}
              >
                <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  {day.dayName}
                </span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 my-1">
                  {day.dayNum}
                </span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center transition group-hover:scale-110">
                  {moodConfig ? (
                    <span className="text-lg" role="img" aria-label={moodConfig.label}>
                      {moodConfig.emoji}
                    </span>
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-stone-300 dark:bg-stone-700" />
                  )}
                </div>
                <span className="text-[9px] font-medium text-stone-500 dark:text-stone-400 truncate max-w-full mt-0.5">
                  {day.mood || (day.isToday ? 'Today' : 'Rest')}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Grid: Section A (Quick Reflection) & Section B (Today's Check-In) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section A: Quick Reflection Card (7 cols) */}
        <section
          id="card-quick-reflection"
          className="lg:col-span-7 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                <PenLine className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Quick Reflection</span>
              </div>
              <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500">
                Structured AI Inquiries
              </span>
            </div>

            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              What’s on your mind today?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              Take a moment to pause. Whether it is untangling a complex decision, celebrating a small milestone, or processing a difficult emotion, thoughtful self-inquiry brings clarity.
            </p>

            {/* Reflection Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              <button
                onClick={() => {
                  if (onNewEntryWithMood) onNewEntryWithMood();
                  setActiveTab('editor');
                }}
                className="p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-200 dark:hover:border-amber-800 text-left transition group"
              >
                <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-amber-950 dark:group-hover:text-amber-200">
                  Open Reflection
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Explore current feelings and thoughts freely.
                </p>
              </button>

              <button
                onClick={() => {
                  if (onNewEntryWithMood) onNewEntryWithMood();
                  setActiveTab('editor');
                }}
                className="p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-200 dark:hover:border-amber-800 text-left transition group"
              >
                <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-amber-950 dark:group-hover:text-amber-200">
                  Problem Solving
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Break down challenges with clear next steps.
                </p>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800/60">
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Private & encrypted in your Firestore sandbox
            </span>
            <button
              id="btn-start-reflection-card"
              onClick={() => setActiveTab('editor')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition"
            >
              <span>Begin Reflection</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* Section B: Today's Check-In (5 cols) */}
        <section
          id="card-todays-checkin"
          className="lg:col-span-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-400">
                <Smile className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Today's Check-In</span>
              </div>
              {selectedMood && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Checked In</span>
                </span>
              )}
            </div>

            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-1.5">
              How are you feeling right now?
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-5">
              Select a mood to tag your mindset. This immediately feeds into your personalized Memory Threads and Weekly retrospective.
            </p>

            {/* Mood selector pills */}
            <div className="grid grid-cols-1 gap-2">
              {moods.map((m) => {
                const isCurrent = selectedMood === m.label;
                return (
                  <button
                    key={m.label}
                    id={`btn-mood-checkin-${m.label.toLowerCase()}`}
                    onClick={() => handleMoodSelect(m.label)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs font-semibold transition active:scale-98 ${
                      isCurrent
                        ? `${m.color} ring-2 ring-amber-500/40 shadow-xs font-bold`
                        : 'border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{m.emoji}</span>
                      <span className="font-bold">{m.label}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">
                      {m.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/60 text-center">
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Selecting a mood starts an active reflection with that mood tag.
            </p>
          </div>
        </section>
      </div>

      {/* 3. Section C: Recent Reflection Preview & Section D: InnerAtlas Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section C: Recent Reflection Preview (7 cols) */}
        <section
          id="section-recent-reflection"
          className="lg:col-span-7 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-stone-800 dark:text-stone-300">
                <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Continue Your Journey</span>
              </div>
              <button
                onClick={() => setActiveTab('timeline')}
                className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 hover:underline"
              >
                View all ({totalEntries}) →
              </button>
            </div>

            {latestEntry ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(latestEntry.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {latestEntry.mood && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getMoodBadgeStyle(
                        latestEntry.mood
                      )}`}
                    >
                      {latestEntry.mood}
                    </span>
                  )}
                  {latestEntry.color && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1"
                      style={{
                        backgroundColor: `${latestEntry.color}15`,
                        borderColor: `${latestEntry.color}40`,
                        color: latestEntry.color,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: latestEntry.color }}
                      />
                      <span>{latestEntry.colorName || 'Color'}</span>
                    </span>
                  )}
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                    {latestEntry.category || 'reflection'}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
                    {latestEntry.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                    {latestEntry.summary ||
                      latestEntry.messages[0]?.content ||
                      'No summary available yet for this entry.'}
                  </p>
                </div>

                {latestEntry.tags && latestEntry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {latestEntry.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-md bg-stone-100 dark:bg-stone-800/80 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:text-stone-300"
                      >
                        <Tag className="h-2.5 w-2.5 text-stone-400" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Empty state when 0 entries exist */
              <div className="py-6 text-center space-y-4">
                <EmptyJournalIllustration className="mx-auto" />
                <div className="max-w-md mx-auto space-y-1.5">
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    Your Inner Atlas Awaits Your First Entry
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Every great voyage of self-discovery begins with a single reflection. Share a thought, capture how you feel, and watch your personal memory threads emerge.
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-home-write-first-entry"
                  onClick={() => setActiveTab('editor')}
                  className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 dark:hover:bg-amber-500 px-5 py-2.5 text-xs font-bold text-white transition shadow-sm cursor-pointer"
                >
                  <PenLine className="h-3.5 w-3.5 text-amber-300 dark:text-stone-950" />
                  <span>Write Your First Reflection</span>
                </button>
              </div>
            )}
          </div>

          {latestEntry && (
            <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 dark:text-stone-500">
                {latestEntry.messages.length} messages in dialogue
              </span>
              <button
                id="btn-home-continue-latest-reflection"
                onClick={() => {
                  onSelectEntry(latestEntry);
                  setActiveTab('editor');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 px-3 py-1.5 text-xs font-bold text-stone-800 dark:text-stone-200 transition"
              >
                <span>Continue Reflection</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </section>

        {/* Section D: Your InnerAtlas Snapshot (5 cols) */}
        <section
          id="section-inneratlas-snapshot"
          className="lg:col-span-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Your InnerAtlas Snapshot</span>
              </div>
              <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                Real-Time Firestore
              </span>
            </div>

            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Personal Metrics
            </h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">
                  Total Entries
                </span>
                <p className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {totalEntries}
                </p>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  Reflections logged
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">
                  Active Days
                </span>
                <p className="font-serif text-2xl font-bold text-amber-800 dark:text-amber-400 mt-0.5">
                  {activeDaysCount}
                </p>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  In past 30 days
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">
                  Top Mood
                </span>
                <p className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mt-1 truncate">
                  {dominantMood}
                </p>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  Dominant mindset
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500">
                  Core Category
                </span>
                <p className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mt-1 capitalize truncate">
                  {topCategory}
                </p>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  Most frequent
                </span>
              </div>
            </div>

            {totalEntries >= 2 ? (
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-950 dark:text-emerald-200">
                  <strong>Memory Synthesis Ready:</strong> You have sufficient journal entries to discover recurring Memory Threads and generate a Weekly Retrospective.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-2.5">
                <Compass className="h-4 w-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-950 dark:text-amber-200">
                  Write at least 2 entries to unlock cross-reflection pattern synthesis in Memory Threads.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/60">
            <button
              onClick={() => setActiveTab('threads')}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200 hover:text-amber-800 dark:hover:text-amber-300 transition"
            >
              <span>Explore Memory Threads</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </div>

      {/* Color Journey Visualizer on Home Dashboard */}
      <ColorJourneyView
        entries={entries}
        onSelectEntry={onSelectEntry}
        onNewEntry={() => setActiveTab('editor')}
      />

      {/* 4. Section E: Quick Access Cards */}
      <section id="section-quick-access" className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
            Quick Access & Explorations
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Jump directly into any wing of your personal growth sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Journey Card 1: Reflect */}
          <div
            id="journey-card-reflect"
            onClick={() => setActiveTab('editor')}
            className="group p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 hover:border-amber-400/80 dark:hover:border-amber-700 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 mb-4 group-hover:scale-110 transition">
                <PenLine className="h-5 w-5 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                Reflect Journal
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Multi-turn self-inquiry with Gemini 3.6 Flash structured reflections and takeaways.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-400 mt-4 group-hover:translate-x-1 transition">
              <span>Open Journal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Journey Card 2: Timeline */}
          <div
            id="journey-card-timeline"
            onClick={() => setActiveTab('timeline')}
            className="group p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 hover:border-amber-400/80 dark:hover:border-amber-700 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 mb-4 group-hover:scale-110 transition">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                Explore Timeline
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Browse chronological entries, filter by moods, and search through your past thoughts.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-stone-800 dark:text-stone-300 mt-4 group-hover:translate-x-1 transition">
              <span>View History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Journey Card 3: Memory Threads */}
          <div
            id="journey-card-threads"
            onClick={() => setActiveTab('threads')}
            className="group p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 hover:border-amber-400/80 dark:hover:border-amber-700 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 text-teal-800 dark:text-teal-300 border border-teal-500/20 mb-4 group-hover:scale-110 transition">
                <GitMerge className="h-5 w-5 text-teal-700 dark:text-teal-400" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                Memory Threads
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Synthesize recurring challenges, emotional patterns, and growth milestones across entries.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-teal-800 dark:text-teal-400 mt-4 group-hover:translate-x-1 transition">
              <span>Discover Patterns</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Journey Card 4: Weekly Insight */}
          <div
            id="journey-card-weekly"
            onClick={() => setActiveTab('weekly')}
            className="group p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 hover:border-amber-400/80 dark:hover:border-amber-700 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-800 dark:text-indigo-300 border border-indigo-500/20 mb-4 group-hover:scale-110 transition">
                <CalendarCheck className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                Weekly Insight
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Generate a 7-day executive retrospective, mindset shifts, celebration of wins, and questions.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-800 dark:text-indigo-400 mt-4 group-hover:translate-x-1 transition">
              <span>Generate Retrospective</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
