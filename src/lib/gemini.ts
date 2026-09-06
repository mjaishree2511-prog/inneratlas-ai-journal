import type { ChatMessage, ReflectionCategory, MoodType, JournalEntry, MemoryThread, WeeklyInsightData } from '../types';

export interface ChatResponse {
  success: boolean;
  reply: string;
  suggestedTags?: string[];
  modelUsed: string;
  timestamp: string;
}

export interface SummaryResponse {
  success: boolean;
  summary: string;
  modelUsed: string;
}

export interface MemoryThreadsResponse {
  success: boolean;
  threads: MemoryThread[];
  modelUsed?: string;
  analyzedCount?: number;
  message?: string;
}

export interface WeeklyInsightResponse {
  success: boolean;
  insight: WeeklyInsightData | null;
  modelUsed?: string;
  message?: string;
}

export async function askGeminiReflection(
  prompt: string,
  history: ChatMessage[],
  mode: ReflectionCategory,
  mood?: MoodType,
  color?: string,
  colorName?: string
): Promise<ChatResponse> {
  const formattedHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content,
  }));

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      history: formattedHistory,
      mode,
      mood,
      color,
      colorName,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function generateEntrySummary(content: string): Promise<SummaryResponse> {
  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function fetchMemoryThreads(entries: JournalEntry[]): Promise<MemoryThreadsResponse> {
  const response = await fetch('/api/memory-threads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      entries,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}

export async function fetchWeeklyInsight(entries: JournalEntry[]): Promise<WeeklyInsightResponse> {
  const response = await fetch('/api/weekly-insight', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      entries,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return response.json();
}
