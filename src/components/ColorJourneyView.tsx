import React from 'react';
import { Palette, Sparkles, Calendar, Compass, ArrowRight, BookOpen } from 'lucide-react';
import type { JournalEntry } from '../types';
import { CURATED_COLOR_PALETTE } from '../types';

interface ColorJourneyViewProps {
  entries: JournalEntry[];
  onSelectEntry?: (entry: JournalEntry) => void;
  onNewEntry?: () => void;
  className?: string;
}

export const ColorJourneyView: React.FC<ColorJourneyViewProps> = ({
  entries,
  onSelectEntry,
  onNewEntry,
  className = '',
}) => {
  // Filter entries that have a color selected
  const colorEntries = entries
    .filter((e) => Boolean(e.color))
    .sort((a, b) => (b.createdAt || b.updatedAt) - (a.createdAt || a.updatedAt));

  // Compute color frequency map
  const colorCounts: Record<string, { hex: string; name: string; count: number }> = {};
  colorEntries.forEach((entry) => {
    if (!entry.color) return;
    const hexKey = entry.color.toLowerCase();
    const curatedMatch = CURATED_COLOR_PALETTE.find((c) => c.hex.toLowerCase() === hexKey);
    const resolvedName = entry.colorName || curatedMatch?.name || 'Custom Hue';

    if (!colorCounts[hexKey]) {
      colorCounts[hexKey] = {
        hex: entry.color,
        name: resolvedName,
        count: 0,
      };
    }
    colorCounts[hexKey].count += 1;
  });

  const frequencyList = Object.values(colorCounts).sort((a, b) => b.count - a.count);

  return (
    <div
      id="section-color-journey"
      className={`rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-5 sm:p-6 shadow-xs transition-colors ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-400">
            <Palette className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Your Color Journey
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              These colors reflect how you chose to express different moments across your reflections.
            </p>
          </div>
        </div>

        {colorEntries.length > 0 && (
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-stone-100 dark:bg-stone-800 px-3 py-1 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
            <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            <span>{colorEntries.length} {colorEntries.length === 1 ? 'Colored Reflection' : 'Colored Reflections'}</span>
          </span>
        )}
      </div>

      {colorEntries.length === 0 ? (
        /* Empty State */
        <div
          id="card-color-journey-empty"
          className="rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 p-6 text-center"
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 mb-3">
            <Palette className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
            No Color Reflections Logged Yet
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto mt-1 leading-relaxed">
            When you create or edit a reflection, choose an Inner World Color that captures how you feel. Your chronological palette and emotional rhythm will unfold here.
          </p>
          {onNewEntry && (
            <button
              id="btn-color-journey-start"
              onClick={onNewEntry}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-stone-900 dark:bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-stone-800 dark:hover:bg-amber-500 transition shadow-2xs"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Start a Colored Reflection</span>
            </button>
          )}
        </div>
      ) : (
        /* Populated State */
        <div className="space-y-5">
          {/* 1. Chronological Ribbon */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 block mb-2.5">
              Chronological Spectrum
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {colorEntries.slice(0, 14).map((entry) => {
                const dateFormatted = new Date(entry.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <button
                    key={entry.id}
                    onClick={() => onSelectEntry && onSelectEntry(entry)}
                    className="group flex flex-col items-center gap-1.5 shrink-0 rounded-2xl p-2 hover:bg-stone-100/70 dark:hover:bg-stone-800/70 transition cursor-pointer"
                    title={`"${entry.title}" (${dateFormatted}) - ${entry.colorName || entry.color}`}
                  >
                    <div
                      className="relative h-9 w-9 rounded-full border-2 border-white dark:border-stone-800 shadow-xs group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: entry.color }}
                    >
                      {entry.mood && (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-stone-900 text-[9px] shadow-xs border border-stone-200 dark:border-stone-700">
                          •
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-stone-600 dark:text-stone-300 max-w-[56px] truncate">
                      {dateFormatted}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Frequency Breakdown Badges */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 block mb-2">
              Palette Palette Distribution
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {frequencyList.map((item) => (
                <div
                  key={item.hex}
                  className="flex items-center gap-2 rounded-xl px-2.5 py-1 text-xs border border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-black/10 dark:border-white/20 shrink-0"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {item.name}
                  </span>
                  <span className="rounded-md bg-stone-200/80 dark:bg-stone-700 px-1.5 py-0.2 text-[10px] font-mono text-stone-700 dark:text-stone-300">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Non-Diagnostic Guiding Note */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
            <span>
              Subjective palette mapping • No scientific claims are made regarding mental health.
            </span>
            {onNewEntry && (
              <button
                onClick={onNewEntry}
                className="text-amber-800 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Add reflection</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
