import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  GitMerge,
  RefreshCw,
  Lock,
  Compass,
  ArrowRight,
  TrendingUp,
  Target,
  AlertTriangle,
  Award,
  Layers,
  Info,
} from 'lucide-react';
import type { JournalEntry, MemoryThread } from '../types';
import { fetchMemoryThreads } from '../lib/gemini';

interface MemoryThreadsViewProps {
  entries: JournalEntry[];
  onSelectEntryByTitle: (title: string) => void;
  onNewEntry: () => void;
}

export const MemoryThreadsView: React.FC<MemoryThreadsViewProps> = ({
  entries,
  onSelectEntryByTitle,
  onNewEntry,
}) => {
  const [threads, setThreads] = useState<MemoryThread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<number | null>(null);

  const analyzeThreads = async () => {
    if (entries.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchMemoryThreads(entries);
      if (response.success) {
        setThreads(response.threads || []);
        setModelUsed(response.modelUsed || 'gemini-3.6-flash');
        setLastAnalyzedAt(Date.now());
      } else {
        setError(response.message || 'Unable to generate memory threads.');
      }
    } catch (err: any) {
      console.error('Error fetching memory threads:', err);
      setError(err.message || 'Failed to synthesize memory threads.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run on first load if entries exist and threads empty
  useEffect(() => {
    if (entries.length > 0 && threads.length === 0 && !lastAnalyzedAt) {
      analyzeThreads();
    }
  }, [entries.length]);

  const getTypeBadge = (type: MemoryThread['type']) => {
    switch (type) {
      case 'recurring_theme':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
            <Layers className="h-3 w-3" /> Recurring Theme
          </span>
        );
      case 'goal_progress':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            <Target className="h-3 w-3" /> Goal Progress
          </span>
        );
      case 'emotional_pattern':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
            <TrendingUp className="h-3 w-3" /> Emotional Pattern
          </span>
        );
      case 'growth_milestone':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            <Award className="h-3 w-3" /> Growth Milestone
          </span>
        );
      case 'recurring_challenge':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
            <AlertTriangle className="h-3 w-3" /> Recurring Challenge
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="view-memory-threads"
      className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-6 lg:px-8 transition-colors"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              Memory Threads
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-200/60 dark:border-amber-800/60 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 dark:text-amber-300">
              <GitMerge className="h-3 w-3" /> Pattern Discovery
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Synthesizes recurring themes, challenges, milestones, and emotional patterns across your private journal history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-refresh-memory-threads"
            onClick={analyzeThreads}
            disabled={entries.length === 0 || isLoading}
            className="flex items-center gap-1.5 rounded-xl bg-stone-900 dark:bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800 dark:hover:bg-amber-500 disabled:opacity-40 transition shadow-xs"
          >
            {isLoading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-amber-300 dark:text-stone-950" />
            )}
            <span>{isLoading ? 'Analyzing Archive...' : 'Refresh Memory Threads'}</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 p-4 text-xs text-stone-600 dark:text-stone-400 shadow-2xs">
        <Lock className="h-4 w-4 text-stone-400 dark:text-stone-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            Strict User-Isolated Privacy Guarantee:
          </span>{' '}
          Insights are generated only from your private journal history. The AI never retrieves,
          analyzes, or exposes data belonging to another user.
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/60 p-4 text-xs text-red-800 dark:text-red-300 shadow-2xs">
          <p className="font-semibold">Unable to generate Memory Threads</p>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 ? (
        <div
          id="card-threads-empty"
          className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-12 text-center shadow-xs transition-colors"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 mb-4 shadow-sm">
            <Compass className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50">
            Memory Threads become more useful as your InnerAtlas grows.
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            Once you have written a few reflections, Gemini connects recurring themes, hidden patterns, and emotional trajectories across your private notes.
          </p>
          <div className="mt-6">
            <button
              id="btn-threads-start-reflection"
              onClick={onNewEntry}
              className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-stone-800 dark:hover:bg-amber-500 transition"
            >
              <Compass className="h-4 w-4" />
              <span>Start a Reflection</span>
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="rounded-3xl border border-amber-200/80 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/30 p-8 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 mb-3 shadow-2xs">
              <Sparkles className="h-5 w-5 motion-safe:animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              Connecting Threads Across Your Reflections...
            </h3>
            <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
              Synthesizing recurring themes, cognitive patterns, and growth trajectories from your {entries.length} reflections.
            </p>
          </div>

          {/* Skeletons Matching Final Memory Thread Cards */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="h-5 w-56 rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />
                <div className="h-6 w-28 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-stone-100 dark:bg-stone-800/70 animate-pulse" />
                <div className="h-3.5 w-4/5 rounded bg-stone-100 dark:bg-stone-800/70 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="h-6 w-20 rounded-full bg-stone-100 dark:bg-stone-800/60 animate-pulse" />
                <div className="h-6 w-24 rounded-full bg-stone-100 dark:bg-stone-800/60 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-10 text-center shadow-xs">
          <Info className="mx-auto h-8 w-8 text-stone-400 dark:text-stone-500 mb-2" />
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            No Distinct Patterns Detected Yet
          </h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            Click "Refresh Memory Threads" to run analysis, or add more journal entries to give the
            reflection engine more depth.
          </p>
        </div>
      ) : (
        /* Threads List */
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
            <span>
              Discovered <strong>{threads.length}</strong> active Memory Threads across{' '}
              <strong>{entries.length}</strong> reflections
            </span>
            {modelUsed && (
              <span className="text-[11px] text-stone-400 dark:text-stone-500">
                Synthesized by {modelUsed}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5">
            {threads.map((thread, idx) => (
              <div
                key={thread.id || idx}
                id={`card-memory-thread-${idx}`}
                className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 sm:p-6 shadow-xs hover:border-amber-500/80 dark:hover:border-amber-500/80 transition-all"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-50">
                    {thread.title}
                  </h3>
                  {getTypeBadge(thread.type)}
                </div>

                {/* Description */}
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
                  {thread.description}
                </p>

                {/* Insight block */}
                <div className="rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 p-4 text-xs text-amber-950 dark:text-amber-200 mb-4 shadow-2xs">
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Core Insight</span>
                  </div>
                  <p className="leading-relaxed">{thread.insights}</p>
                </div>

                {/* Connected Reflections & Suggested Focus */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                  {/* Connected entries */}
                  <div>
                    <span className="font-semibold text-stone-600 dark:text-stone-400 block mb-1.5">
                      Connected Reflections:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {thread.connectedEntryTitles && thread.connectedEntryTitles.length > 0 ? (
                        thread.connectedEntryTitles.map((title, tIdx) => (
                          <button
                            key={tIdx}
                            onClick={() => onSelectEntryByTitle(title)}
                            className="inline-flex items-center gap-1 rounded-xl bg-stone-100 dark:bg-stone-800 px-2.5 py-1 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition font-medium text-left"
                            title={`Open reflection: ${title}`}
                          >
                            <span>{title}</span>
                            <ArrowRight className="h-2.5 w-2.5 text-stone-400" />
                          </button>
                        ))
                      ) : (
                        <span className="text-stone-400 italic">Journal archive</span>
                      )}
                    </div>
                  </div>

                  {/* Suggested Focus */}
                  {thread.suggestedFocus && (
                    <div className="rounded-2xl bg-stone-50 dark:bg-stone-950/60 p-3 border border-stone-200/80 dark:border-stone-800">
                      <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-0.5">
                        Suggested Reflection Focus:
                      </span>
                      <p className="text-stone-600 dark:text-stone-400 italic">"{thread.suggestedFocus}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
