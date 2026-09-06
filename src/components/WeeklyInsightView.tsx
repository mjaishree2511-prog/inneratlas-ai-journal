import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  RefreshCw,
  HelpCircle,
  Award,
  AlertCircle,
  Compass,
  TrendingUp,
  Lock,
  ArrowRight,
  Palette,
} from 'lucide-react';
import type { JournalEntry, WeeklyInsightData } from '../types';
import { fetchWeeklyInsight } from '../lib/gemini';
import { ColorJourneyView } from './ColorJourneyView';

interface WeeklyInsightViewProps {
  entries: JournalEntry[];
  onNewEntry: () => void;
  onOpenTimeline: () => void;
}

export const WeeklyInsightView: React.FC<WeeklyInsightViewProps> = ({
  entries,
  onNewEntry,
  onOpenTimeline,
}) => {
  const [insight, setInsight] = useState<WeeklyInsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const INSIGHT_LOADING_MESSAGES = [
    'Looking beneath the surface...',
    "Connecting your week's emotional threads...",
    'Tracing subtle mindset shifts...',
    'Synthesizing your personal milestones...',
  ];

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % INSIGHT_LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Filter entries from past 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentEntries = entries.filter(
    (e) => (e.createdAt || e.updatedAt) >= sevenDaysAgo
  );

  const generateWeeklyInsight = async () => {
    if (recentEntries.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWeeklyInsight(recentEntries);
      if (response.success && response.insight) {
        setInsight(response.insight);
        setModelUsed(response.modelUsed || 'gemini-3.6-flash');
      } else {
        setError(response.message || 'Unable to generate weekly insight.');
      }
    } catch (err: any) {
      console.error('Error fetching weekly insight:', err);
      setError(err.message || 'Failed to synthesize weekly insight.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (recentEntries.length > 0 && !insight) {
      generateWeeklyInsight();
    }
  }, [recentEntries.length]);

  return (
    <div
      id="view-weekly-insight"
      className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-6 lg:px-8 transition-colors"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              Weekly Insight
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 dark:bg-teal-950/80 border border-teal-200/60 dark:border-teal-800/60 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800 dark:text-teal-300">
              <Calendar className="h-3 w-3" /> Past 7 Days
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            "What changed beneath the surface this week?" — Synthesized from your reflections over the past 7 days.
          </p>
        </div>

        <button
          id="btn-refresh-weekly-insight"
          onClick={generateWeeklyInsight}
          disabled={recentEntries.length === 0 || isLoading}
          className="flex items-center gap-1.5 rounded-xl bg-stone-900 dark:bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800 dark:hover:bg-amber-500 disabled:opacity-40 transition shadow-xs"
        >
          {isLoading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 text-amber-300 dark:text-stone-950" />
          )}
          <span>{isLoading ? 'Synthesizing Week...' : 'Refresh Weekly Insight'}</span>
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 p-4 text-xs text-stone-600 dark:text-stone-400 shadow-2xs">
        <Lock className="h-4 w-4 text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            Private Reflection Synthesis:
          </span>{' '}
          Analysis is derived exclusively from your past 7 days of journal entries. Note: InnerAtlas provides reflective inquiry and does not make medical, clinical, or diagnostic claims.
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/60 p-4 text-xs text-red-800 dark:text-red-300 shadow-2xs">
          <p className="font-semibold">Unable to generate Weekly Insight</p>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Empty State: No entries in past 7 days */}
      {recentEntries.length === 0 ? (
        <div
          id="card-weekly-empty"
          className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-12 text-center shadow-xs transition-colors"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 mb-4 shadow-sm">
            <Calendar className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50">
            Weekly Insights synthesize the subtle shifts across your last 7 days.
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            Write reflections throughout the week to see your weekly retrospective, mindset shifts, and emotional patterns emerge.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              id="btn-weekly-new-entry"
              onClick={onNewEntry}
              className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-stone-800 dark:hover:bg-amber-500 transition"
            >
              <Compass className="h-4 w-4" />
              <span>Write a New Reflection</span>
            </button>
            {entries.length > 0 && (
              <button
                id="btn-weekly-view-timeline"
                onClick={onOpenTimeline}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-5 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition"
              >
                <span>View Older Timeline ({entries.length} total)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : isLoading ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Branded Insight Loading Banner */}
          <div className="rounded-3xl border border-teal-200/80 dark:border-teal-800/80 bg-teal-50/50 dark:bg-teal-950/30 p-8 sm:p-10 text-center shadow-xs relative overflow-hidden">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700/60 mb-4 shadow-2xs">
              <Sparkles className="h-6 w-6 motion-safe:animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              "{INSIGHT_LOADING_MESSAGES[loadingMessageIndex]}"
            </h3>
            <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
              Evaluating your {recentEntries.length} reflections from the past 7 days to reveal mindset shifts and emotional trajectories.
            </p>
          </div>

          {/* Skeletons Matching Final Executive Summary & Grid */}
          <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 p-6 sm:p-7 shadow-xs space-y-3">
            <div className="h-4 w-48 rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full rounded bg-stone-100 dark:bg-stone-800/80 animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-stone-100 dark:bg-stone-800/80 animate-pulse" />
              <div className="h-3 w-4/6 rounded bg-stone-100 dark:bg-stone-800/80 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />
                  <div className="h-4 w-32 rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-3 w-full rounded bg-stone-100 dark:bg-stone-800/60 animate-pulse" />
                  <div className="h-3 w-4/5 rounded bg-stone-100 dark:bg-stone-800/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : insight ? (
        <div className="space-y-6">
          {/* Executive Overview Card */}
          <div
            id="card-weekly-executive-summary"
            className="rounded-3xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/70 dark:bg-teal-950/40 p-6 sm:p-7 shadow-xs"
          >
            <div className="flex items-center justify-between gap-2 mb-3 text-teal-900 dark:text-teal-300">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                What Changed Beneath the Surface This Week?
              </span>
              <span className="text-xs font-semibold text-teal-800 dark:text-teal-400">
                {recentEntries.length} entries analyzed
              </span>
            </div>
            <p className="text-sm sm:text-base font-normal text-stone-800 dark:text-stone-200 leading-relaxed">
              {insight.executiveSummary}
            </p>
          </div>

          {/* Grid of Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Main Themes */}
            <div
              id="card-weekly-themes"
              className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-3 text-stone-900 dark:text-stone-50 font-serif font-bold text-base">
                <Compass className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h3>Main Themes Observed</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300">
                {insight.mainThemes && insight.mainThemes.length > 0 ? (
                  insight.mainThemes.map((theme, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{theme}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-stone-400 italic">No strong thematic clusters detected.</li>
                )}
              </ul>
            </div>

            {/* Emotional Patterns */}
            <div
              id="card-weekly-emotions"
              className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-3 text-stone-900 dark:text-stone-50 font-serif font-bold text-base">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3>Emotional Patterns & Mood Flow</h3>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {insight.emotionalPatterns || 'Consistent emotional baseline across the week.'}
              </p>
            </div>

            {/* Wins & Positive Progress */}
            <div
              id="card-weekly-wins"
              className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-3 text-stone-900 dark:text-stone-50 font-serif font-bold text-base">
                <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3>Wins & Personal Progress</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300">
                {insight.winsAndProgress && insight.winsAndProgress.length > 0 ? (
                  insight.winsAndProgress.map((win, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{win}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-stone-400 italic">No specific wins recorded this week.</li>
                )}
              </ul>
            </div>

            {/* Recurring Challenges */}
            <div
              id="card-weekly-challenges"
              className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-3 text-stone-900 dark:text-stone-50 font-serif font-bold text-base">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                <h3>Recurring Challenges & Friction</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300">
                {insight.recurringChallenges && insight.recurringChallenges.length > 0 ? (
                  insight.recurringChallenges.map((ch, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-600 dark:bg-rose-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{ch}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-stone-400 italic">No recurring bottlenecks logged.</li>
                )}
              </ul>
            </div>
            {/* Color Journey Retrospective (if generated) */}
            {insight.colorJourneySummary && (
              <div
                id="card-weekly-color-journey"
                className="rounded-3xl border border-amber-200/80 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/30 p-6 shadow-xs md:col-span-2"
              >
                <div className="flex items-center gap-2 mb-2 text-stone-900 dark:text-stone-50 font-serif font-bold text-base">
                  <Palette className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <h3>Weekly Color Palette & Emotional Atmosphere</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {insight.colorJourneySummary}
                </p>
              </div>
            )}
          </div>

          {/* Color Journey Visualizer */}
          <ColorJourneyView
            entries={recentEntries}
            onNewEntry={onNewEntry}
            className="mt-6"
          />

          {/* Guiding Question for the Upcoming Week */}
          <div
            id="card-weekly-guiding-question"
            className="rounded-3xl border border-stone-900 dark:border-stone-700 bg-stone-900 dark:bg-stone-950 p-6 sm:p-7 text-white shadow-md"
          >
            <div className="flex items-center gap-2 mb-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <HelpCircle className="h-4 w-4" />
              <span>Thoughtful Question for Future Reflection</span>
            </div>
            <p className="font-serif text-lg sm:text-xl text-stone-100 italic leading-relaxed">
              "{insight.thoughtfulQuestion}"
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
