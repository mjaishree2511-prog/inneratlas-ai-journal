import React from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Search,
  Sprout,
  Target,
  HelpCircle,
  MessageSquareHeart,
  Compass,
} from 'lucide-react';

interface StructuredReflectionContentProps {
  content: string;
}

/**
 * Custom renderer for Gemini's structured reflection messages.
 * Maps reflection sections (What I'm Hearing, Patterns I Notice, etc.)
 * to refined, high-contrast visual section badges with dedicated icons.
 */
export const StructuredReflectionContent: React.FC<StructuredReflectionContentProps> = ({
  content,
}) => {
  // Check children text to identify section type
  const renderHeading = (children: React.ReactNode) => {
    const text = String(children || '').trim();

    if (text.includes("What I'm Hearing") || text.includes('Hearing')) {
      return (
        <div className="flex items-center gap-2 mt-5 mb-2.5 pb-1 border-b border-amber-200/60 dark:border-amber-900/60">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            <MessageSquareHeart className="h-3.5 w-3.5" />
          </div>
          <h4 className="font-serif text-sm sm:text-base font-bold text-amber-950 dark:text-amber-200 tracking-tight">
            What I'm Hearing
          </h4>
        </div>
      );
    }

    if (text.includes('Patterns I Notice') || text.includes('Patterns')) {
      return (
        <div className="flex items-center gap-2 mt-5 mb-2.5 pb-1 border-b border-teal-200/60 dark:border-teal-900/60">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
            <Search className="h-3.5 w-3.5" />
          </div>
          <h4 className="font-serif text-sm sm:text-base font-bold text-teal-950 dark:text-teal-200 tracking-tight">
            Patterns I Notice
          </h4>
        </div>
      );
    }

    if (text.includes('A Different Perspective') || text.includes('Perspective')) {
      return (
        <div className="flex items-center gap-2 mt-5 mb-2.5 pb-1 border-b border-emerald-200/60 dark:border-emerald-900/60">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            <Sprout className="h-3.5 w-3.5" />
          </div>
          <h4 className="font-serif text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-200 tracking-tight">
            A Different Perspective
          </h4>
        </div>
      );
    }

    if (text.includes('Key Insight') || text.includes('Insight')) {
      return (
        <div className="flex items-center gap-2 mt-5 mb-2.5 pb-1 border-b border-amber-200/60 dark:border-amber-900/60">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h4 className="font-serif text-sm sm:text-base font-bold text-amber-950 dark:text-amber-200 tracking-tight">
            Key Insight
          </h4>
        </div>
      );
    }

    if (text.includes('Gentle Next Step') || text.includes('Next Step')) {
      return (
        <div className="flex items-center gap-2 mt-5 mb-2.5 pb-1 border-b border-sky-200/60 dark:border-sky-900/60">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
            <Target className="h-3.5 w-3.5" />
          </div>
          <h4 className="font-serif text-sm sm:text-base font-bold text-sky-950 dark:text-sky-200 tracking-tight">
            Gentle Next Step
          </h4>
        </div>
      );
    }

    if (text.includes('One Question to Explore') || text.includes('Question')) {
      return (
        <div className="flex items-center gap-2 mt-6 mb-2.5 pb-1 border-b border-indigo-200/60 dark:border-indigo-900/60">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
            <HelpCircle className="h-3.5 w-3.5" />
          </div>
          <h4 className="font-serif text-sm sm:text-base font-bold text-indigo-950 dark:text-indigo-200 tracking-tight">
            One Question to Explore
          </h4>
        </div>
      );
    }

    // Default Fallback Heading
    return (
      <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 mt-4 mb-2 flex items-center gap-1.5">
        <Compass className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        <span>{children}</span>
      </h4>
    );
  };

  return (
    <div className="markdown-body text-stone-900 dark:text-stone-100 leading-relaxed text-sm">
      <Markdown
        components={{
          h1: ({ children }) => renderHeading(children),
          h2: ({ children }) => renderHeading(children),
          h3: ({ children }) => renderHeading(children),
          h4: ({ children }) => renderHeading(children),
          p: ({ children }) => (
            <p className="mb-3 text-stone-700 dark:text-stone-300 leading-relaxed text-[13.5px] sm:text-sm font-normal">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 mb-3 text-stone-700 dark:text-stone-300 pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 mb-3 text-stone-700 dark:text-stone-300 pl-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-stone-700 dark:text-stone-300 leading-relaxed text-[13.5px] sm:text-sm">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-amber-500/60 pl-3.5 py-1 italic bg-amber-50/40 dark:bg-amber-950/20 rounded-r-xl text-stone-700 dark:text-stone-300 text-xs sm:text-sm">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-stone-900 dark:text-stone-100">
              {children}
            </strong>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
