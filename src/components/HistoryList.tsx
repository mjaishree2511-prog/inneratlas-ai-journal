import React, { useState } from 'react';
import {
  Search,
  Calendar,
  MessageSquare,
  Sparkles,
  Tag,
  Trash2,
  ArrowRight,
  Filter,
  BookOpen,
  LayoutGrid,
  GitCommit,
  Smile,
  Heart,
  Meh,
  Zap,
  CloudRain,
  Plus,
} from 'lucide-react';
import type { JournalEntry, MoodType } from '../types';
import { ColorJourneyView } from './ColorJourneyView';
import { EmptyJournalIllustration } from './CelestialCompassVisual';

interface HistoryListProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => Promise<void>;
  onNewEntry: () => void;
  isLoading?: boolean;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  entries,
  onSelectEntry,
  onDeleteEntry,
  onNewEntry,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  // Gather unique tags
  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags || [])));

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.summary && entry.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || entry.category === selectedCategory;

    const matchesMood =
      selectedMood === 'all' || entry.mood === selectedMood;

    const matchesTag =
      selectedTag === 'all' || (entry.tags && entry.tags.includes(selectedTag));

    return matchesSearch && matchesCategory && matchesMood && matchesTag;
  });

  // Sort descending by date
  const sortedEntries = [...filteredEntries].sort(
    (a, b) => (b.createdAt || b.updatedAt) - (a.createdAt || a.updatedAt)
  );

  const getMoodBadge = (mood?: MoodType) => {
    switch (mood) {
      case 'Great':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
            <Smile className="h-3 w-3" /> Great
          </span>
        );
      case 'Calm':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2 py-0.5 text-[11px] font-bold text-teal-800 dark:text-teal-300">
            <Heart className="h-3 w-3" /> Calm
          </span>
        );
      case 'Neutral':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 px-2 py-0.5 text-[11px] font-bold text-stone-800 dark:text-stone-300">
            <Meh className="h-3 w-3" /> Neutral
          </span>
        );
      case 'Stressed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
            <Zap className="h-3 w-3" /> Stressed
          </span>
        );
      case 'Sad':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 text-[11px] font-bold text-sky-800 dark:text-sky-300">
            <CloudRain className="h-3 w-3" /> Sad
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'reflection':
        return 'Deep Reflection';
      case 'brainstorm':
        return 'Brainstorming';
      case 'action-items':
        return 'Action Plan';
      case 'gratitude':
        return 'Gratitude & Wins';
      case 'problem-solving':
        return 'Problem Solving';
      default:
        return category;
    }
  };

  return (
    <div
      id="view-reflection-timeline"
      className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-6 lg:px-8 transition-colors"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Reflection Timeline
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Your personal growth journey and chronological thought map.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800/80 p-0.5">
            <button
              id="btn-toggle-view-timeline"
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <GitCommit className="h-3.5 w-3.5" />
              <span>Timeline</span>
            </button>
            <button
              id="btn-toggle-view-grid"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
          </div>

          <button
            id="btn-history-new-entry"
            onClick={onNewEntry}
            className="flex items-center gap-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Reflection</span>
          </button>
        </div>
      </div>

      {/* Color Journey Feature Banner */}
      <ColorJourneyView
        entries={entries}
        onSelectEntry={onSelectEntry}
        onNewEntry={onNewEntry}
        className="mb-8"
      />

      {/* Filter and Search Bar */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-4">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400 dark:text-stone-500" />
          <input
            id="input-search-history"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reflections by keywords, insights, or phrases..."
            className="w-full rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 py-2.5 pl-10 pr-3 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:border-amber-600 dark:focus:border-amber-400 focus:outline-hidden shadow-2xs"
          />
        </div>

        {/* Category selector */}
        <div className="relative sm:col-span-1">
          <Filter className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400 dark:text-stone-500" />
          <select
            id="select-filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 py-2.5 pl-10 pr-3 text-xs text-stone-900 dark:text-stone-100 focus:border-amber-600 dark:focus:border-amber-400 focus:outline-hidden shadow-2xs"
          >
            <option value="all">All Focus Modes</option>
            <option value="reflection">Deep Reflection</option>
            <option value="brainstorm">Brainstorming</option>
            <option value="action-items">Action Plan</option>
            <option value="gratitude">Gratitude & Wins</option>
            <option value="problem-solving">Problem Solving</option>
          </select>
        </div>

        {/* Tags selector */}
        <div className="relative sm:col-span-1">
          <Tag className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-stone-400 dark:text-stone-500" />
          <select
            id="select-filter-tag"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 py-2.5 pl-10 pr-3 text-xs text-stone-900 dark:text-stone-100 focus:border-amber-600 dark:focus:border-amber-400 focus:outline-hidden shadow-2xs"
          >
            <option value="all">All Tags ({allTags.length})</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Entries Display */}
      {isLoading ? (
        /* Timeline Spine Skeleton View */
        <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 dark:border-stone-800 space-y-6 animate-in fade-in duration-300">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 p-5 sm:p-6 shadow-xs space-y-3"
            >
              {/* Spine Node Skeleton */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-6 h-6 w-6 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse border-2 border-stone-100 dark:border-stone-900" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="h-5 w-48 rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 rounded-full bg-stone-100 dark:bg-stone-800/80 animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-stone-100 dark:bg-stone-800/80 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="h-3.5 w-full rounded bg-stone-100 dark:bg-stone-800/70 animate-pulse" />
                <div className="h-3.5 w-4/6 rounded bg-stone-100 dark:bg-stone-800/70 animate-pulse" />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <div className="h-5 w-14 rounded-md bg-stone-100 dark:bg-stone-800/60 animate-pulse" />
                <div className="h-5 w-16 rounded-md bg-stone-100 dark:bg-stone-800/60 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedEntries.length === 0 ? (
        <div
          id="card-timeline-empty"
          className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-8 sm:p-12 text-center shadow-xs transition-colors"
        >
          {entries.length === 0 ? (
            <EmptyJournalIllustration className="mx-auto mb-4" />
          ) : (
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 mb-4 shadow-sm">
              <BookOpen className="h-7 w-7" />
            </div>
          )}
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50">
            {entries.length === 0 ? 'Your Timeline is Clear and Open' : 'No matching reflections found.'}
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            {entries.length === 0
              ? 'Your timeline will slowly become a constellation of the moments, ideas, challenges, and growth you choose to capture.'
              : 'Try adjusting your search query, mood filter, or selected tag.'}
          </p>

          {entries.length === 0 && (
            <button
              id="btn-create-first-reflection"
              onClick={onNewEntry}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-stone-800 dark:hover:bg-amber-500 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Reflection</span>
            </button>
          )}
        </div>
      ) : viewMode === 'timeline' ? (
        /* Timeline Spine View */
        <div
          id="timeline-spine-container"
          className="relative pl-6 sm:pl-8 border-l-2 border-amber-300/60 dark:border-amber-800/60 space-y-6"
        >
          {sortedEntries.map((entry) => {
            const firstUserMsg = entry.messages.find((m) => m.role === 'user');
            const previewText =
              entry.summary || (firstUserMsg ? firstUserMsg.content : 'No reflection text.');
            const entryDate = new Date(entry.createdAt || entry.updatedAt);

            return (
              <div
                key={entry.id}
                id={`timeline-node-${entry.id}`}
                className="group relative rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-amber-500/80 dark:hover:border-amber-500/80"
                onClick={() => onSelectEntry(entry)}
              >
                {/* Node indicator on left vertical line */}
                <div
                  className="absolute -left-[31px] sm:-left-[39px] top-6 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-stone-950 border-2 shadow-xs transition-colors"
                  style={{ borderColor: entry.color || '#D97706' }}
                >
                  <div
                    className="h-2 w-2 rounded-full transition-colors"
                    style={{ backgroundColor: entry.color || '#D97706' }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                      {getCategoryLabel(entry.category)}
                    </span>
                    {getMoodBadge(entry.mood)}
                    {entry.color && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border"
                        style={{
                          backgroundColor: `${entry.color}15`,
                          borderColor: `${entry.color}40`,
                          color: entry.color,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.colorName || 'Color'}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{entryDate.toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-50 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition">
                  {entry.title || 'Untitled Reflection'}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                  {previewText}
                </p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-3 text-xs">
                  <div className="flex items-center gap-3 text-stone-400 dark:text-stone-500">
                    <span className="flex items-center gap-1 font-medium">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {entry.messages.length} turns
                    </span>
                    {entry.summary && (
                      <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />
                        Synthesized
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete reflection "${entry.title}"?`)) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="p-1.5 text-stone-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition"
                      title="Delete entry"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <span className="inline-flex items-center gap-1 font-bold text-amber-800 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Cards Grid View */
        <div id="grid-cards-container" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedEntries.map((entry) => {
            const firstUserMsg = entry.messages.find((m) => m.role === 'user');
            const previewText =
              entry.summary || (firstUserMsg ? firstUserMsg.content : 'No reflection text.');
            const entryDate = new Date(entry.createdAt || entry.updatedAt);

            return (
              <div
                key={entry.id}
                id={`card-entry-${entry.id}`}
                className="group flex flex-col justify-between rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-amber-500/80 dark:hover:border-amber-500/80"
                onClick={() => onSelectEntry(entry)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                      {getCategoryLabel(entry.category)}
                    </span>
                    <span className="text-xs text-stone-400 dark:text-stone-500">
                      {entryDate.toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-50 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition">
                    {entry.title || 'Untitled Reflection'}
                  </h3>

                  <div className="mt-2 mb-2 flex items-center gap-2 flex-wrap">
                    {getMoodBadge(entry.mood)}
                    {entry.color && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border"
                        style={{
                          backgroundColor: `${entry.color}15`,
                          borderColor: `${entry.color}40`,
                          color: entry.color,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.colorName || 'Color'}</span>
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                    {previewText}
                  </p>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {entry.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-lg bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 text-[10px] font-semibold text-amber-900 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-3 text-xs">
                  <div className="flex items-center gap-3 text-stone-400 dark:text-stone-500">
                    <span className="flex items-center gap-1 font-medium">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {entry.messages.length} turns
                    </span>
                    {entry.summary && (
                      <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />
                        Synthesized
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete reflection "${entry.title}"?`)) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="p-1.5 text-stone-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition"
                      title="Delete entry"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onSelectEntry(entry)}
                      className="flex items-center gap-1 rounded-xl bg-stone-100 dark:bg-stone-800 px-3 py-1 font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
                    >
                      <span>Open</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
