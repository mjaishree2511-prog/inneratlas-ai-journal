export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme?: ThemeMode;
  reducedMotion?: boolean;
  defaultCategory?: ReflectionCategory;
  completedOnboarding?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  completedOnboarding?: boolean;
  theme?: ThemeMode;
  reducedMotion?: boolean;
  defaultCategory?: ReflectionCategory;
}

export type NavTabType =
  | 'home'
  | 'editor'
  | 'timeline'
  | 'threads'
  | 'weekly'
  | 'profile'
  | 'settings'
  | 'security'
  | 'testing';

export type MoodType = 'Great' | 'Calm' | 'Neutral' | 'Stressed' | 'Sad';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  suggestedTags?: string[];
}

export type ReflectionCategory =
  | 'reflection'
  | 'brainstorm'
  | 'gratitude'
  | 'problem-solving'
  | 'growth'
  | 'action-items';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  meaning: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export const CURATED_COLOR_PALETTE: ColorOption[] = [
  {
    id: 'crimson',
    name: 'Warm Crimson',
    hex: '#EF4444',
    meaning: 'Passion, energy, raw drive, or active tension',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-400',
    textClass: 'text-red-600 dark:text-red-400',
  },
  {
    id: 'ochre',
    name: 'Amber Glow',
    hex: '#F97316',
    meaning: 'Warmth, transition, vitality, and creative spark',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-400',
    textClass: 'text-orange-600 dark:text-orange-400',
  },
  {
    id: 'gold',
    name: 'Golden Sun',
    hex: '#EAB308',
    meaning: 'Clarity, optimism, brightness, and awakening',
    bgClass: 'bg-amber-400',
    borderClass: 'border-amber-300',
    textClass: 'text-amber-600 dark:text-amber-300',
  },
  {
    id: 'forest',
    name: 'Forest Moss',
    hex: '#10B981',
    meaning: 'Growth, restoration, grounded presence, and renewal',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-400',
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    hex: '#3B82F6',
    meaning: 'Calm, depth, introspective stillness, and perspective',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-400',
    textClass: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'violet',
    name: 'Mystic Violet',
    hex: '#8B5CF6',
    meaning: 'Intuition, mystery, dream space, and wonder',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-400',
    textClass: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'rose',
    name: 'Soft Rose',
    hex: '#EC4899',
    meaning: 'Self-compassion, tenderness, vulnerability, and love',
    bgClass: 'bg-pink-500',
    borderClass: 'border-pink-400',
    textClass: 'text-pink-600 dark:text-pink-400',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Night',
    hex: '#292524',
    meaning: 'Grounded stillness, boundary protection, and silence',
    bgClass: 'bg-stone-800',
    borderClass: 'border-stone-600',
    textClass: 'text-stone-700 dark:text-stone-300',
  },
  {
    id: 'slate',
    name: 'Pristine Slate',
    hex: '#E7E5E4',
    meaning: 'Spaciousness, fresh canvas, openness, and unburdened quiet',
    bgClass: 'bg-stone-200',
    borderClass: 'border-stone-300',
    textClass: 'text-stone-600 dark:text-stone-300',
  },
];

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  category: ReflectionCategory;
  messages: ChatMessage[];
  summary?: string;
  mood?: MoodType;
  color?: string; // Hex color (e.g. #3B82F6) representing user's self-expression
  colorName?: string; // Curated or custom label (e.g. "Deep Ocean")
  tags: string[];
  suggestedTags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface MemoryThread {
  id: string;
  title: string;
  type: 'recurring_theme' | 'goal_progress' | 'emotional_pattern' | 'growth_milestone' | 'recurring_challenge';
  description: string;
  insights: string;
  connectedEntryTitles: string[];
  suggestedFocus: string;
}

export interface WeeklyInsightData {
  generatedAt: number;
  periodStart: number;
  periodEnd: number;
  entryCount: number;
  mainThemes: string[];
  emotionalPatterns: string;
  colorJourneySummary?: string;
  winsAndProgress: string[];
  recurringChallenges: string[];
  thoughtfulQuestion: string;
  executiveSummary: string;
}

export interface ThreatModelItem {
  zone: string;
  scenario: string;
  vulnerability: string;
  countermeasure: string;
  owaspRef: string;
  status: 'Implemented' | 'Enforced';
}
