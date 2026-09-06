import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Send,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  FileText,
  Lightbulb,
  ListChecks,
  Compass,
  Tag,
  Trash2,
  Smile,
  Heart,
  Meh,
  Zap,
  CloudRain,
  Lock,
  Plus,
  ArrowDown,
  Edit3,
  Bot,
  User as UserIcon,
} from 'lucide-react';
import type { JournalEntry, ChatMessage, ReflectionCategory, MoodType } from '../types';
import { askGeminiReflection, generateEntrySummary } from '../lib/gemini';
import { ColorReflectionPicker } from './ColorReflectionPicker';
import { GeminiCompanion } from './GeminiCompanion';
import { StructuredReflectionContent } from './StructuredReflectionContent';

interface JournalEditorProps {
  entry: JournalEntry;
  onUpdateEntry: (updated: JournalEntry) => Promise<void>;
  onDeleteEntry: (entryId: string) => Promise<void>;
  isSaving: boolean;
  saveError: string | null;
  lastSavedAt: number | null;
  onRetrySave: () => void;
}

const MOODS: {
  id: MoodType;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
}[] = [
  {
    id: 'Great',
    label: 'Great',
    icon: <Smile className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />,
    activeColor: 'text-emerald-800 dark:text-emerald-200',
    activeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    activeBorder: 'border-emerald-300 dark:border-emerald-700',
  },
  {
    id: 'Calm',
    label: 'Calm',
    icon: <Heart className="h-4 w-4 text-teal-500 dark:text-teal-400" />,
    activeColor: 'text-teal-800 dark:text-teal-200',
    activeBg: 'bg-teal-50 dark:bg-teal-950/60',
    activeBorder: 'border-teal-300 dark:border-teal-700',
  },
  {
    id: 'Neutral',
    label: 'Neutral',
    icon: <Meh className="h-4 w-4 text-stone-500 dark:text-stone-400" />,
    activeColor: 'text-stone-800 dark:text-stone-200',
    activeBg: 'bg-stone-100 dark:bg-stone-800',
    activeBorder: 'border-stone-300 dark:border-stone-600',
  },
  {
    id: 'Stressed',
    label: 'Stressed',
    icon: <Zap className="h-4 w-4 text-amber-500 dark:text-amber-400" />,
    activeColor: 'text-amber-800 dark:text-amber-200',
    activeBg: 'bg-amber-50 dark:bg-amber-950/60',
    activeBorder: 'border-amber-300 dark:border-amber-700',
  },
  {
    id: 'Sad',
    label: 'Sad',
    icon: <CloudRain className="h-4 w-4 text-sky-500 dark:text-sky-400" />,
    activeColor: 'text-sky-800 dark:text-sky-200',
    activeBg: 'bg-sky-50 dark:bg-sky-950/60',
    activeBorder: 'border-sky-300 dark:border-sky-700',
  },
];

const CATEGORIES: {
  id: ReflectionCategory;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    id: 'reflection',
    label: 'Deep Reflection',
    icon: <Compass className="h-4 w-4" />,
    desc: 'Explore your thoughts more deeply with empathetic inquiry',
  },
  {
    id: 'brainstorm',
    label: 'Brainstorming',
    icon: <Lightbulb className="h-4 w-4" />,
    desc: 'Turn scattered ideas into possibilities and fresh angles',
  },
  {
    id: 'action-items',
    label: 'Action Plan',
    icon: <ListChecks className="h-4 w-4" />,
    desc: 'Transform thoughts into practical, prioritized next steps',
  },
  {
    id: 'gratitude',
    label: 'Gratitude & Wins',
    icon: <Sparkles className="h-4 w-4" />,
    desc: 'Celebrate progress & savor positive moments',
  },
  {
    id: 'problem-solving',
    label: 'Problem Solving',
    icon: <FileText className="h-4 w-4" />,
    desc: 'Unpack obstacles, trade-offs, and decision criteria',
  },
];

const STARTER_PROMPTS = [
  'Something I keep thinking about is...',
  'Right now, I wish I understood...',
  'One thing that challenged me today was...',
  'Something I’m proud of lately is...',
  'If I could be completely honest with myself...',
  'Today, I felt most like myself when...',
];

export const JournalEditor: React.FC<JournalEditorProps> = ({
  entry,
  onUpdateEntry,
  onDeleteEntry,
  isSaving,
  saveError,
  lastSavedAt,
  onRetrySave,
}) => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasNewResponse, setHasNewResponse] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(entry.title);
  const [suggestedTags, setSuggestedTags] = useState<string[]>(entry.suggestedTags || []);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleValue(entry.title);
    setSuggestedTags(entry.suggestedTags || []);
  }, [entry.id, entry.title, entry.suggestedTags]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entry.messages, isGenerating]);

  const handleTitleSubmit = async () => {
    setIsEditingTitle(false);
    if (titleValue.trim() && titleValue !== entry.title) {
      await onUpdateEntry({
        ...entry,
        title: titleValue.trim(),
      });
    }
  };

  const handleMoodSelect = async (selectedMood: MoodType) => {
    const newMood = entry.mood === selectedMood ? undefined : selectedMood;
    await onUpdateEntry({
      ...entry,
      mood: newMood,
    });
  };

  const handleCategoryChange = async (cat: ReflectionCategory) => {
    await onUpdateEntry({
      ...entry,
      category: cat,
    });
  };

  const handleAddCustomTag = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput
        .trim()
        .toLowerCase()
        .replace(/^#/, '')
        .replace(/[^a-z0-9_-]/g, '');

      if (cleanTag && !entry.tags.includes(cleanTag)) {
        const updatedTags = [...entry.tags, cleanTag];
        setTagInput('');
        await onUpdateEntry({
          ...entry,
          tags: updatedTags,
        });
      }
    }
  };

  const handleAcceptSuggestedTag = async (tagToAdd: string) => {
    const cleanTag = tagToAdd.toLowerCase().replace(/^#/, '').trim();
    if (!entry.tags.includes(cleanTag)) {
      const updatedTags = [...entry.tags, cleanTag];
      const remainingSuggested = suggestedTags.filter((t) => t !== tagToAdd);
      setSuggestedTags(remainingSuggested);
      await onUpdateEntry({
        ...entry,
        tags: updatedTags,
        suggestedTags: remainingSuggested,
      });
    }
  };

  const handleDismissSuggestedTag = async (tagToDismiss: string) => {
    const remainingSuggested = suggestedTags.filter((t) => t !== tagToDismiss);
    setSuggestedTags(remainingSuggested);
    await onUpdateEntry({
      ...entry,
      suggestedTags: remainingSuggested,
    });
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = entry.tags.filter((t) => t !== tagToRemove);
    await onUpdateEntry({
      ...entry,
      tags: updatedTags,
    });
  };

  const handleColorSelect = async (hex: string, name: string) => {
    await onUpdateEntry({
      ...entry,
      color: hex,
      colorName: name,
    });
  };

  const handleColorClear = async () => {
    await onUpdateEntry({
      ...entry,
      color: undefined,
      colorName: undefined,
    });
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputText(prompt);
    textareaRef.current?.focus();
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputText.trim();
    if (!prompt || isGenerating) return;

    setAiError(null);
    setIsGenerating(true);

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    // Optimistically prepare message array
    const updatedMessagesWithUser = [...entry.messages, userMessage];

    // Auto-update title if it's default Untitled
    let updatedTitle = entry.title;
    if (
      entry.title === 'Untitled Reflection' ||
      entry.title === 'New Reflection' ||
      entry.title.trim() === ''
    ) {
      updatedTitle = prompt.length > 42 ? prompt.substring(0, 42) + '...' : prompt;
      setTitleValue(updatedTitle);
    }

    try {
      // Call server-side Gemini endpoint with mood, category, and color context
      const aiResponse = await askGeminiReflection(
        prompt,
        entry.messages,
        entry.category,
        entry.mood,
        entry.color,
        entry.colorName
      );

      const newSuggested = aiResponse.suggestedTags || [];
      const filteredSuggested = newSuggested.filter(
        (t) => !entry.tags.includes(t.toLowerCase())
      );

      const assistantMessage: ChatMessage = {
        id: 'msg-' + (Date.now() + 1) + '-' + Math.random().toString(36).substr(2, 4),
        role: 'assistant',
        content: aiResponse.reply,
        timestamp: Date.now(),
        suggestedTags: filteredSuggested,
      };

      const finalMessages = [...updatedMessagesWithUser, assistantMessage];
      setSuggestedTags(filteredSuggested);

      // Save complete interaction to Firestore
      await onUpdateEntry({
        ...entry,
        title: updatedTitle,
        messages: finalMessages,
        suggestedTags: filteredSuggested,
      });

      // Trigger companion celebration reaction
      setHasNewResponse(true);
      setTimeout(() => setHasNewResponse(false), 3500);

      // Clear input text only after confirmed AI completion
      setInputText('');
    } catch (err: any) {
      console.error('Failed to get Gemini response:', err);
      setAiError(err.message || 'Failed to generate AI response. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickSummarize = async () => {
    if (entry.messages.length === 0 || isSummarizing) return;

    try {
      setIsSummarizing(true);
      setAiError(null);

      const fullTranscript = entry.messages
        .map((m) => `${m.role === 'user' ? 'User' : 'Gemini'}: ${m.content}`)
        .join('\n\n');

      const response = await generateEntrySummary(fullTranscript);

      await onUpdateEntry({
        ...entry,
        summary: response.summary,
      });
    } catch (err: any) {
      console.error('Summarize error:', err);
      setAiError(err.message || 'Failed to generate summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const currentDateFormatted = new Date(entry.createdAt || Date.now()).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <div
      id="view-journal-editor"
      className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-6 lg:px-8 transition-colors"
    >
      {/* Welcoming Header & Date */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <span>{currentDateFormatted}</span>
            <span>•</span>
            <span className="text-stone-500 dark:text-stone-400">Private Reflection</span>
          </div>

          {/* Title with inline edit */}
          {isEditingTitle ? (
            <div className="mt-1 flex items-center gap-2 max-w-lg">
              <input
                id="input-entry-title"
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-1.5 text-lg font-bold text-stone-900 dark:text-stone-50 focus:border-amber-600 dark:focus:border-amber-400 focus:outline-hidden shadow-xs"
                placeholder="Give this reflection a title..."
                autoFocus
              />
              <button
                id="btn-confirm-title"
                onClick={handleTitleSubmit}
                className="rounded-xl bg-stone-900 dark:bg-amber-600 p-2 text-white hover:bg-stone-800 dark:hover:bg-amber-500 transition shadow-xs"
                title="Save Title"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="group mt-1 flex items-center gap-2.5">
              <h1
                id="header-entry-title"
                onClick={() => setIsEditingTitle(true)}
                className="cursor-pointer font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 hover:text-amber-800 dark:hover:text-amber-400 transition"
                title="Click to edit title"
              >
                {entry.title || 'Untitled Reflection'}
              </h1>
              <button
                id="btn-edit-title-trigger"
                onClick={() => setIsEditingTitle(true)}
                className="rounded-lg p-1 text-stone-400 opacity-0 group-hover:opacity-100 hover:text-stone-700 dark:hover:text-stone-200 transition"
                title="Edit Title"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              {entry.color && (
                <div
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 border text-xs shadow-2xs"
                  style={{
                    backgroundColor: `${entry.color}15`,
                    borderColor: `${entry.color}40`,
                  }}
                  title={`Color Reflection: ${entry.colorName || entry.color}`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="font-semibold text-[11px] text-stone-700 dark:text-stone-300">
                    {entry.colorName || 'Colored'}
                  </span>
                </div>
              )}
            </div>
          )}
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            "Take a moment. Your thoughts have somewhere to go."
          </p>
        </div>

        {/* Sync & Action Status */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs self-start md:self-auto">
          {isSaving ? (
            <span
              id="badge-saving-status"
              className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/70 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 animate-in fade-in duration-200"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Saving your reflection...
            </span>
          ) : saveError ? (
            <div className="flex items-center gap-2">
              <span
                id="badge-save-error"
                className="flex items-center gap-1 text-red-700 dark:text-red-300 font-medium bg-red-50 dark:bg-red-950/70 px-3 py-1 rounded-full border border-red-200 dark:border-red-800"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                Sync Failed
              </span>
              <button
                id="btn-retry-save"
                onClick={onRetrySave}
                className="rounded-full bg-red-600 px-2.5 py-1 text-white font-medium hover:bg-red-700 transition text-[11px] cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : lastSavedAt ? (
            <span
              id="badge-saved-status"
              className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-[11px] animate-in fade-in duration-200"
            >
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Reflection saved ✨
            </span>
          ) : null}

          {/* Delete entry action */}
          <button
            id="btn-delete-current-entry"
            onClick={() => {
              if (
                confirm(
                  'Are you sure you want to permanently delete this journal entry from Firestore?'
                )
              ) {
                onDeleteEntry(entry.id);
              }
            }}
            className="rounded-xl p-2 text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            title="Delete this reflection"
            aria-label="Delete entry"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mood Check-In & Focus Mode Selector */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mood Check-in */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Personal Mood Check-in
            </span>
            {entry.mood ? (
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                Selected: <strong className="text-stone-800 dark:text-stone-200">{entry.mood}</strong>
              </span>
            ) : (
              <span className="text-[11px] text-stone-400">How are you feeling right now?</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {MOODS.map((moodItem) => {
              const isSelected = entry.mood === moodItem.id;
              return (
                <button
                  key={moodItem.id}
                  id={`btn-mood-${moodItem.id.toLowerCase()}`}
                  onClick={() => handleMoodSelect(moodItem.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? `${moodItem.activeBg} ${moodItem.activeColor} border-2 ${moodItem.activeBorder} shadow-xs scale-102`
                      : 'bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border border-stone-200/70 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                  aria-pressed={isSelected}
                >
                  {moodItem.icon}
                  <span>{moodItem.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reflection Focus Modes */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Reflection Focus Mode
            </span>
            <button
              id="btn-generate-summary"
              onClick={handleQuickSummarize}
              disabled={entry.messages.length === 0 || isSummarizing}
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 disabled:opacity-40 transition"
              title="Generate 3-sentence executive summary"
            >
              {isSummarizing ? (
                <RefreshCw className="h-3 w-3 animate-spin text-amber-600 dark:text-amber-400" />
              ) : (
                <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              )}
              <span>{entry.summary ? 'Update Synthesis' : 'AI Synthesis'}</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = entry.category === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`btn-category-${cat.id}`}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`group relative flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-stone-900 dark:bg-amber-500 text-amber-300 dark:text-stone-950 shadow-xs scale-102'
                      : 'bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border border-stone-200/70 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                  title={cat.desc}
                  aria-pressed={isSelected}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Color Reflection Picker: Personal subjective inner-state color */}
      <ColorReflectionPicker
        selectedColor={entry.color}
        selectedColorName={entry.colorName}
        onSelectColor={handleColorSelect}
        onClearColor={handleColorClear}
        className="mb-6"
      />

      {/* Summary Box (if generated) */}
      {entry.summary && (
        <div
          id="card-entry-summary"
          className="mb-6 rounded-2xl border border-amber-200 dark:border-amber-800/70 bg-amber-50/80 dark:bg-amber-950/40 p-4 sm:p-5 shadow-xs transition-all"
        >
          <div className="flex items-center gap-2 mb-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Executive Reflection Synthesis</span>
          </div>
          <div className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed markdown-body">
            <Markdown>{entry.summary}</Markdown>
          </div>
        </div>
      )}

      {/* AI Errors Banner */}
      {aiError && (
        <div
          id="banner-ai-error"
          className="mb-6 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 p-4 text-sm text-red-800 dark:text-red-300 flex items-start justify-between gap-3 shadow-xs"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">AI Interaction Notice</p>
              <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">{aiError}</p>
            </div>
          </div>
          <button
            id="btn-dismiss-ai-error"
            onClick={() => setAiError(null)}
            className="text-xs text-red-700 dark:text-red-400 hover:underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Conversation Feed */}
      <div
        id="feed-reflection-messages"
        className="mb-6 min-h-[340px] max-h-[560px] overflow-y-auto space-y-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/60 p-4 sm:p-6 shadow-inner transition-colors"
      >
        {entry.messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 mb-4 shadow-sm">
              <Compass className="h-7 w-7" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50">
              Your story starts with one thought.
            </h2>
            <p className="mt-2 max-w-md text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Write down something that's been sitting in your mind. There is no perfect way to begin.
            </p>

            <button
              id="btn-start-reflecting-action"
              onClick={() => textareaRef.current?.focus()}
              className="mt-5 flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-stone-800 dark:hover:bg-amber-500 transition"
            >
              <Compass className="h-4 w-4" />
              <span>Start Reflecting</span>
            </button>

            {/* Clickable Starter Prompts */}
            <div className="mt-8 w-full max-w-xl text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block text-center mb-3">
                Optional Reflection Prompts
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTER_PROMPTS.map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPrompt(promptText)}
                    className="rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-800/80 p-3 text-left text-xs font-medium text-stone-700 dark:text-stone-300 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-stone-700/80 transition shadow-2xs"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          entry.messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Message Header Label */}
              <div
                className={`flex items-center gap-1.5 mb-1 px-1.5 text-[11px] font-bold uppercase tracking-wider ${
                  msg.role === 'user'
                    ? 'text-stone-500 dark:text-stone-400'
                    : 'text-amber-800 dark:text-amber-400'
                }`}
              >
                {msg.role === 'user' ? (
                  <>
                    <UserIcon className="h-3 w-3 text-stone-400" />
                    <span>You</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    <span>InnerAtlas Mentor</span>
                  </>
                )}
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-normal">
                  • {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[95%] sm:max-w-[88%] rounded-3xl text-sm leading-relaxed shadow-xs transition-all ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-stone-50 rounded-tr-xs dark:bg-stone-800 dark:text-stone-50 px-5 py-3.5 border border-stone-800 dark:border-stone-700'
                    : 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200/90 dark:border-stone-800 rounded-tl-xs px-5 sm:px-6 py-5 shadow-sm'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap font-normal text-[13.5px] sm:text-sm leading-relaxed">
                    {msg.content}
                  </p>
                ) : (
                  <StructuredReflectionContent content={msg.content} />
                )}
              </div>
            </div>
          ))
        )}

        {isGenerating && (
          <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-1.5 mb-1 px-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400 animate-spin" />
              <span>InnerAtlas Thinking</span>
            </div>
            <div className="rounded-3xl bg-white dark:bg-stone-800 border border-amber-200/80 dark:border-amber-800/80 px-5 py-4 text-sm text-stone-700 dark:text-stone-300 rounded-tl-xs flex items-center gap-3 shadow-xs">
              <div className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                Atlas is contemplating your reflection & synthesizing insights...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Tags Bar (if any available) */}
      {suggestedTags.length > 0 && (
        <div
          id="bar-suggested-tags"
          className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 px-4 py-2.5 text-xs text-amber-900 dark:text-amber-300 shadow-2xs animate-in fade-in"
        >
          <div className="flex items-center gap-1.5 font-bold shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>AI Suggested Tags:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {suggestedTags.map((sTag) => (
              <span
                key={sTag}
                className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-700 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:text-amber-200 shadow-2xs"
              >
                <span>#{sTag}</span>
                <button
                  type="button"
                  onClick={() => handleAcceptSuggestedTag(sTag)}
                  className="rounded-full bg-amber-100 dark:bg-amber-900 p-0.5 text-amber-800 dark:text-amber-300 hover:bg-amber-200"
                  title="Add tag"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDismissSuggestedTag(sTag)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  title="Dismiss tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Input Writing Workspace */}
      <form onSubmit={handleSendMessage} className="relative">
        <div className="rounded-3xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-3 sm:p-4 shadow-sm focus-within:border-amber-600 dark:focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition">
          <textarea
            id="textarea-journal-input"
            ref={textareaRef}
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Reflect freely in ${entry.category} mode... (Cmd/Ctrl + Enter to send)`}
            className="w-full resize-none border-0 bg-transparent p-1 text-sm text-stone-900 dark:text-stone-50 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-hidden leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800 pt-3 px-1">
            {/* Active & Custom Tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-lg bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-xs text-stone-800 dark:text-stone-200 font-semibold border border-stone-200 dark:border-stone-700"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-stone-400 hover:text-red-500 ml-0.5"
                    title={`Remove #${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                id="input-tag-add"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="+ tag (press Enter)"
                className="w-32 text-xs bg-transparent text-stone-700 dark:text-stone-300 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-hidden"
              />
            </div>

            {/* Reflect Submit Action & Gemini Companion */}
            <div className="flex items-center gap-3">
              <GeminiCompanion
                isThinking={isGenerating}
                hasNewResponse={hasNewResponse}
                onCompanionClick={() => {
                  const prompts = [
                    'What feeling is most present for you right now?',
                    'If you could express one unspoken thought, what is it?',
                    'What is a challenge you faced today that taught you something?',
                    'Take a slow breath. Write freely without editing yourself.',
                  ];
                  const pick = prompts[Math.floor(Math.random() * prompts.length)];
                  setInputText(pick);
                  textareaRef.current?.focus();
                }}
              />

              <button
                id="btn-send-message"
                type="submit"
                disabled={!inputText.trim() || isGenerating}
                className="flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 dark:hover:bg-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-40 transition cursor-pointer"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Reflect</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Privacy Guarantee Footer */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-400 dark:text-stone-500">
        <Lock className="h-3 w-3 text-stone-400 dark:text-stone-500" />
        <span>Strictly private. Stored exclusively in your isolated Firestore path.</span>
      </div>
    </div>
  );
};
