import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Top-Level Request Deserialization (Ordering Guarantee)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set yet. Model calls will fail gracefully.');
    }
    genAIClient = new GoogleGenAI({ apiKey: apiKey || 'MISSING_API_KEY' });
  }
  return genAIClient;
}

// Resilient Model Fallback Ladder
const MODEL_FALLBACK_LADDER = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.7-flash',
];

interface ChatMessageInput {
  role: 'user' | 'assistant' | 'model' | 'system';
  content: string;
}

// Resilient generation helper with fallback ladder
async function generateWithFallback(
  prompt: string,
  systemInstruction?: string,
  history?: ChatMessageInput[],
  jsonMode: boolean = false
): Promise<{ text: string; modelUsed: string }> {
  const ai = getGeminiClient();
  let lastError: any = null;

  for (const modelName of MODEL_FALLBACK_LADDER) {
    try {
      console.log(`Attempting generation with model: ${modelName}`);

      let contents: any[] = [];
      if (history && history.length > 0) {
        contents = history.map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : msg.role === 'system' ? 'user' : msg.role,
          parts: [{ text: msg.content }],
        }));
      }

      // Add the final user prompt if not already present
      if (prompt) {
        contents.push({
          role: 'user',
          parts: [{ text: prompt }],
        });
      }

      const config: any = {};
      if (systemInstruction) {
        config.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }
      if (jsonMode) {
        config.responseMimeType = 'application/json';
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      const responseText = response.text || '';
      return { text: responseText, modelUsed: modelName };
    } catch (err: any) {
      console.warn(`Model ${modelName} failed with error:`, err?.message || err);
      lastError = err;
      // Recoverable error: try next model in fallback ladder
      continue;
    }
  }

  throw new Error(
    `All Gemini fallback models exhausted. Last error: ${lastError?.message || 'Unknown generation error'}`
  );
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'InnerAtlas',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    models: MODEL_FALLBACK_LADDER,
  });
});

// Helper to extract suggested tags from response text
function extractSuggestedTags(text: string): { cleanText: string; tags: string[] } {
  const tagRegex = /###\s*Suggested Tags\s*\n+([\s\S]*?)$/i;
  const match = text.match(tagRegex);
  const tags: string[] = [];

  let cleanText = text;
  if (match) {
    cleanText = text.replace(tagRegex, '').trim();
    const tagBlock = match[1];
    const extracted = tagBlock.match(/#([a-zA-Z0-9_-]+)/g);
    if (extracted) {
      extracted.forEach((t) => {
        const clean = t.replace(/^#/, '').toLowerCase().trim();
        if (clean && !tags.includes(clean) && tags.length < 5) {
          tags.push(clean);
        }
      });
    }
  }

  // Fallback: search for inline hashtags if none found
  if (tags.length === 0) {
    const inlineMatches = text.match(/#([a-zA-Z0-9_-]+)/g);
    if (inlineMatches) {
      inlineMatches.slice(0, 4).forEach((t) => {
        const clean = t.replace(/^#/, '').toLowerCase().trim();
        if (clean && !tags.includes(clean)) {
          tags.push(clean);
        }
      });
    }
  }

  return { cleanText, tags };
}

// AI Chat / Reflection Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const history = Array.isArray(body.history) ? body.history : [];
    const mode = typeof body.mode === 'string' ? body.mode : 'reflection';
    const mood = typeof body.mood === 'string' ? body.mood : '';
    const color = typeof body.color === 'string' ? body.color.trim() : '';
    const colorName = typeof body.colorName === 'string' ? body.colorName.trim() : '';
    const customInstruction = typeof body.systemInstruction === 'string' ? body.systemInstruction : '';

    if (!prompt && history.length === 0) {
      return res.status(400).json({ error: 'Either prompt or conversation history is required.' });
    }

    let systemInstruction = customInstruction;
    if (!systemInstruction) {
      const moodContext = mood ? ` The user currently notes their personal mood as "${mood}". Be attuned to this context with warmth and composure.` : '';
      
      const colorContext = colorName || color
        ? ` The user also chose a personal "Color Reflection" representing their inner world at this moment: ${colorName ? `"${colorName}"` : ''} (${color || ''}). You may subjectively, gently, and poetically reflect on this color alongside what they wrote (e.g., "You chose ${colorName || 'this color'} for this reflection. Alongside what you shared, that may evoke calm, depth, vitality, or something completely personal to you."). IMPORTANT SAFETY DIRECTIVE: Never claim that a color scientifically proves, diagnoses, or determines a person's mental state. Keep all color observations reflective, subjective, and non-diagnostic.`
        : '';

      const structureGuide = `
Format your response using clean, inviting, highly scannable Markdown with structured sections. Use tasteful emojis naturally within section headers to support emotional resonance and readability without making it look childish:

### 💭 What I'm Hearing
A brief, empathetic reflection mirroring back what the user is experiencing and feeling.

### 🔍 Patterns I Notice
Observe underlying habits, themes, or recurring dynamics in their reflection.

### 🌱 A Different Perspective
Offer a constructive reframing, fresh angle, or clarifying insight.

### ✨ Key Insight
A meaningful takeaway that honors their self-awareness and progress.

### 🎯 Gentle Next Step
A practical, low-pressure experiment or concrete action they could explore.

### ❓ One Question to Explore
Conclude with exactly one thoughtful, open-ended question that encourages further self-inquiry.

At the very end of your response, always include a suggested tags block in this exact format:
### Suggested Tags
#tag1 #tag2 #tag3

(Suggest 2 to 5 concise, lowercase topic tags relevant to their reflection, e.g. #productivity, #stress, #career, #clarity, #relationships).
Tone guidelines:
- Keep your tone grounded, encouraging, emotionally intelligent, and natural.
- Do not make medical, psychological, or diagnostic claims.
- Frame observations purely as reflective inquiry based on the user's words.${colorContext}`;

      if (mode === 'reflection') {
        systemInstruction =
          `You are InnerAtlas, a compassionate, thoughtful personal reflection mentor.${moodContext} Help the user process their thoughts and develop mindful self-awareness.${structureGuide}`;
      } else if (mode === 'brainstorm') {
        systemInstruction =
          `You are InnerAtlas in creative brainstorming mode.${moodContext} Help the user expand on ideas, discover unexpected connections, and explore creative avenues.${structureGuide}`;
      } else if (mode === 'action-items') {
        systemInstruction =
          `You are InnerAtlas in action planning mode.${moodContext} Transform thoughts, worries, or goals into prioritized, practical next steps and gentle frameworks.${structureGuide}`;
      } else if (mode === 'gratitude') {
        systemInstruction =
          `You are InnerAtlas in gratitude and celebration mode.${moodContext} Help the user celebrate wins, savor meaningful moments, and reinforce positive milestones.${structureGuide}`;
      } else if (mode === 'problem-solving') {
        systemInstruction =
          `You are InnerAtlas in problem-solving mode.${moodContext} Facilitate root-cause exploration, trade-off clarity, and actionable decision criteria.${structureGuide}`;
      } else {
        systemInstruction =
          `You are InnerAtlas, an insightful AI journaling mentor.${moodContext}${structureGuide}`;
      }
    }

    const result = await generateWithFallback(prompt, systemInstruction, history);
    const { cleanText, tags } = extractSuggestedTags(result.text);

    return res.json({
      success: true,
      reply: cleanText || result.text,
      suggestedTags: tags,
      modelUsed: result.modelUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    return res.status(500).json({
      error: error.message || 'Internal error occurred during AI processing.',
    });
  }
});

// AI Summarization Endpoint
app.post('/api/summarize', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const content = typeof body.content === 'string' ? body.content.trim() : '';

    if (!content) {
      return res.status(400).json({ error: 'Content is required to generate a summary.' });
    }

    const prompt = `Please provide a concise 2-3 sentence executive summary and 3 key takeaways of the following journal/reflection entry:\n\n${content}`;
    const systemInstruction = 'You are InnerAtlas. Create elegant, empathetic, bulleted executive summaries.';

    const result = await generateWithFallback(prompt, systemInstruction);

    return res.json({
      success: true,
      summary: result.text,
      modelUsed: result.modelUsed,
    });
  } catch (error: any) {
    console.error('API /api/summarize error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate summary.',
    });
  }
});

// Memory Threads Analysis Endpoint
app.post('/api/memory-threads', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const entries = Array.isArray(body.entries) ? body.entries : [];

    if (entries.length === 0) {
      return res.json({
        success: true,
        threads: [],
        message: 'No journal entries provided for Memory Threads analysis.',
      });
    }

    // Format strictly this user's entries
    const entriesSummary = entries.map((entry: any, idx: number) => {
      const dateStr = entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Unknown date';
      const moodStr = entry.mood ? ` [Mood: ${entry.mood}]` : '';
      const colorStr = entry.colorName || entry.color ? ` [Color Reflection: ${entry.colorName || entry.color}]` : '';
      const tagsStr = Array.isArray(entry.tags) && entry.tags.length ? ` [Tags: ${entry.tags.join(', ')}]` : '';
      const snippet = entry.messages && entry.messages.length
        ? entry.messages.map((m: any) => `${m.role}: ${m.content}`).join(' ')
        : (entry.summary || '');
      return `Entry ${idx + 1}: "${entry.title || 'Untitled'}" (${dateStr})${moodStr}${colorStr}${tagsStr}\nContent: ${snippet.substring(0, 400)}`;
    }).join('\n\n---\n\n');

    const systemInstruction = `You are InnerAtlas Memory Threads Engine. You analyze a single user's private journal archive to discover meaningful connections, recurring themes, emotional patterns, goal progression, and challenges across their entries.
IMPORTANT PRIVACY & ACCURACY RULES:
- Only analyze the provided entries. Do not invent details not present in the user's reflections.
- If the user chose Color Reflections, you may recognize recurring color themes as subjective self-expression (e.g., choosing ocean calm during moments of clarity, or warm crimson during active periods).
- Do not make medical, therapeutic, or psychological diagnoses.
- Provide positive, constructive, and empowering pattern recognition.
- Output strictly JSON in the following schema:
{
  "threads": [
    {
      "id": "thread-1",
      "title": "Short descriptive thread title",
      "type": "recurring_theme" | "goal_progress" | "emotional_pattern" | "growth_milestone" | "recurring_challenge",
      "description": "2-3 sentences explaining the recurring pattern observed across entries",
      "insights": "Key insight on how this pattern influences their day-to-day thinking or progress",
      "connectedEntryTitles": ["Entry Title 1", "Entry Title 2"],
      "suggestedFocus": "One practical question or focus area for future reflections"
    }
  ]
}`;

    const prompt = `Here are the authenticated user's journal entries:\n\n${entriesSummary}\n\nPlease identify 2 to 5 high-value Memory Threads connecting these entries. Return strictly valid JSON.`;

    const result = await generateWithFallback(prompt, systemInstruction, undefined, true);

    let parsed: any;
    try {
      parsed = JSON.parse(result.text);
    } catch {
      // Clean potential backticks if returned
      const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      threads: parsed.threads || [],
      modelUsed: result.modelUsed,
      analyzedCount: entries.length,
    });
  } catch (error: any) {
    console.error('API /api/memory-threads error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate Memory Threads.',
    });
  }
});

// Weekly Insight Endpoint ("What changed beneath the surface this week?")
app.post('/api/weekly-insight', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const entries = Array.isArray(body.entries) ? body.entries : [];

    if (entries.length === 0) {
      return res.json({
        success: true,
        insight: null,
        message: 'No entries found in the past 7 days.',
      });
    }

    const entriesSummary = entries.map((entry: any, idx: number) => {
      const dateStr = entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Recent';
      const moodStr = entry.mood ? ` [Mood: ${entry.mood}]` : '';
      const colorStr = entry.colorName || entry.color ? ` [Color: ${entry.colorName || entry.color}]` : '';
      const tagsStr = Array.isArray(entry.tags) && entry.tags.length ? ` [Tags: ${entry.tags.join(', ')}]` : '';
      const snippet = entry.messages && entry.messages.length
        ? entry.messages.map((m: any) => `${m.role}: ${m.content}`).join(' ')
        : (entry.summary || '');
      return `Entry ${idx + 1}: "${entry.title || 'Untitled'}" (${dateStr})${moodStr}${colorStr}${tagsStr}\nContent: ${snippet.substring(0, 500)}`;
    }).join('\n\n---\n\n');

    const systemInstruction = `You are InnerAtlas, specializing in deep weekly retrospective synthesis.
The user asked: "What changed beneath the surface this week?"
Analyze the provided journal entries from this user's past 7 days to reveal subtle shifts in mindset, emotional trajectories, triumphs, and lingering questions.
IMPORTANT RULES:
- Never fabricate insights. Ground all takeaways strictly in the user's provided entries.
- If the user selected colors for their reflections, you may subjectively notice their color journey (e.g., shifts in color palette from tense crimson to calm ocean blue) as creative self-expression.
- Do not make clinical, medical, diagnostic, or therapeutic claims.
- Return strictly valid JSON with this schema:
{
  "executiveSummary": "2-3 sentences providing an overarching synthesis of what shifted beneath the surface this week.",
  "mainThemes": ["Theme 1 with context", "Theme 2 with context", "Theme 3 with context"],
  "emotionalPatterns": "Detailed paragraph describing emotional trajectories, mood consistency, or transitions (e.g. from stressed to calm).",
  "colorJourneySummary": "Optional 1-2 sentences on the palette of colors selected this week as personal creative expression (or null if no colors were selected).",
  "winsAndProgress": ["Specific achievement, mindset win, or milestone observed in the entries", "Another win"],
  "recurringChallenges": ["Obstacle, recurring worry, or bottleneck mentioned across days"],
  "thoughtfulQuestion": "A profound, evocative question for future reflection to guide the coming week."
}`;

    const prompt = `Here are the authenticated user's reflections from the past 7 days (${entries.length} entries):\n\n${entriesSummary}\n\nSynthesize what changed beneath the surface this week. Return strictly JSON.`;

    const result = await generateWithFallback(prompt, systemInstruction, undefined, true);

    let parsed: any;
    try {
      parsed = JSON.parse(result.text);
    } catch {
      const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    return res.json({
      success: true,
      insight: {
        generatedAt: now,
        periodStart: sevenDaysAgo,
        periodEnd: now,
        entryCount: entries.length,
        executiveSummary: parsed.executiveSummary || 'A week of mindful self-reflection and growth.',
        mainThemes: Array.isArray(parsed.mainThemes) ? parsed.mainThemes : [],
        emotionalPatterns: parsed.emotionalPatterns || 'Balanced emotional awareness across reflections.',
        colorJourneySummary: parsed.colorJourneySummary || undefined,
        winsAndProgress: Array.isArray(parsed.winsAndProgress) ? parsed.winsAndProgress : [],
        recurringChallenges: Array.isArray(parsed.recurringChallenges) ? parsed.recurringChallenges : [],
        thoughtfulQuestion: parsed.thoughtfulQuestion || 'What intention will best serve you in the week ahead?',
      },
      modelUsed: result.modelUsed,
    });
  } catch (error: any) {
    console.error('API /api/weekly-insight error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate Weekly Insight.',
    });
  }
});

// Vite Middleware for Dev / Static serving for Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`InnerAtlas server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
