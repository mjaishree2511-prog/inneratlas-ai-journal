import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Database,
  Lock,
  RefreshCw,
  GitMerge,
  Calendar,
  Smile,
  Tag,
  Sun,
} from 'lucide-react';

interface TestCase {
  id: string;
  title: string;
  category: 'Auth' | 'Reflection' | 'Mood' | 'Tags' | 'Timeline' | 'MemoryThreads' | 'WeeklyInsight' | 'Security' | 'Persistence' | 'Onboarding' | 'Theme';
  preconditions: string;
  steps: string[];
  expectedResult: string;
}

const TEST_CASES: TestCase[] = [
  {
    id: 'TC-01',
    title: 'Google Federated Authentication Flow & Session Hydration',
    category: 'Auth',
    preconditions: 'User is unauthenticated on the InnerAtlas landing screen.',
    steps: [
      'Click the "Continue with Google" sign-in button.',
      'Authenticate through the Firebase Google Auth popup window.',
      'Observe the application state transition.',
    ],
    expectedResult:
      'User is redirected to the private reflection workspace. User profile info is displayed in the navigation bar. Firestore listener attaches strictly to /users/{uid}/interactions.',
  },
  {
    id: 'TC-02',
    title: 'Personal Mood Check-in & Real-time Mood Tagging',
    category: 'Mood',
    preconditions: 'Authenticated user is on the Current Reflection editor.',
    steps: [
      'Locate the "Personal Mood Check-in" pill selector bar.',
      'Select "Great", "Calm", "Neutral", "Stressed", or "Sad".',
      'Observe the active mood badge highlight and checkmark.',
      'Type a reflection prompt and submit.',
    ],
    expectedResult:
      'The selected mood is persisted to the Firestore document with zero undefined fields, passed as context to the Gemini prompt, and appears on the Reflection Timeline.',
  },
  {
    id: 'TC-03',
    title: 'Structured Gemini Reflection Response Breakdown',
    category: 'Reflection',
    preconditions: 'User is in an active reflection entry.',
    steps: [
      'Type a reflection describing a personal situation or dilemma into the textarea.',
      'Click "Reflect" or press Cmd/Ctrl + Enter.',
      'Inspect the returned Gemini response format.',
    ],
    expectedResult:
      'Gemini renders structured markdown sections ("What I\'m Hearing", "Patterns or Themes", "A Different Perspective", "One Question to Explore") in an elegant readable format without diagnostic/medical claims.',
  },
  {
    id: 'TC-04',
    title: 'AI-Suggested Smart Tags Extraction & Acceptance',
    category: 'Tags',
    preconditions: 'User receives a response from Gemini in an active reflection.',
    steps: [
      'Observe the "AI Suggested Tags" chip bar beneath the chat message feed.',
      'Click the "+ tag" button on a suggested tag (e.g. "+ #focus").',
      'Observe the tag move into the active tags collection.',
      'Type a custom tag into the tag input and press Enter.',
    ],
    expectedResult:
      'Accepted and custom tags are deduplicated, normalized to lowercase, and persisted with the reflection in Firestore.',
  },
  {
    id: 'TC-05',
    title: 'Executive Reflection Summarization Engine',
    category: 'Reflection',
    preconditions: 'Reflection entry has at least 1 turn of conversation.',
    steps: [
      'Click the "AI Synthesis" button in the focus mode bar.',
      'Wait for the server-side /api/summarize call to resolve.',
    ],
    expectedResult:
      'A structured executive synthesis card renders above the reflection feed, containing key takeaways and auto-saving to Firestore.',
  },
  {
    id: 'TC-06',
    title: 'Reflection Timeline Chronological Visualization & Filtering',
    category: 'Timeline',
    preconditions: 'User has created one or more reflections.',
    steps: [
      'Navigate to the "Timeline" tab in the navbar.',
      'Toggle between "Timeline" spine view and "Cards" grid view.',
      'Filter by Mood (e.g. "Great" or "Stressed"), Category, or search keywords.',
      'Click "Open" on any timeline entry.',
    ],
    expectedResult:
      'Entries render sorted chronologically with mood badges, tags, and summary previews. Clicking "Open" loads the exact entry into the editor.',
  },
  {
    id: 'TC-07',
    title: 'Memory Threads Cross-Entry Pattern Recognition',
    category: 'MemoryThreads',
    preconditions: 'User has multiple saved reflections across different dates.',
    steps: [
      'Click the "Memory Threads" tab in the navbar.',
      'Click "Refresh Memory Threads".',
      'Inspect generated pattern cards (e.g. Recurring Themes, Emotional Patterns, Growth Milestones).',
      'Click on a connected reflection title badge inside any thread card.',
    ],
    expectedResult:
      'Gemini synthesizes connections across the user\'s private journal archive. Clicking a connected reflection navigates directly to that entry.',
  },
  {
    id: 'TC-08',
    title: 'Weekly Insight ("What changed beneath the surface this week?")',
    category: 'WeeklyInsight',
    preconditions: 'User has reflections created within the past 7 days.',
    steps: [
      'Navigate to the "Weekly Insight" tab in the navbar.',
      'Click "Refresh Weekly Insight".',
      'Review Executive Overview, Main Themes, Emotional Patterns, Wins, Recurring Challenges, and Guiding Question.',
    ],
    expectedResult:
      'A holistic retrospective report is synthesized strictly for the 7-day window. Non-medical/non-diagnostic tone is upheld.',
  },
  {
    id: 'TC-09',
    title: 'Lightweight Onboarding Tour & Tour Recall',
    category: 'Onboarding',
    preconditions: 'User logs in for the first time or clicks the help tour button in the navbar.',
    steps: [
      'Observe the 3-step Onboarding Modal detailing Reflect, Discover, and Understand.',
      'Navigate forward and backward through steps.',
      'Click "Get Started" or "Skip tour".',
      'Click the help tour icon in the navbar to re-open.',
    ],
    expectedResult:
      'Onboarding explains the product clearly, saves completedOnboarding preference to Firestore/localStorage, and can be recalled at any time.',
  },
  {
    id: 'TC-10',
    title: 'Dark / Light Theme Toggle & Persistence',
    category: 'Theme',
    preconditions: 'User is on any screen in InnerAtlas.',
    steps: [
      'Click the Sun / Moon theme toggle icon in the navbar.',
      'Observe immediate visual switch across all cards, modals, and typography.',
      'Refresh the browser or navigate between tabs.',
    ],
    expectedResult:
      'Theme changes smoothly, passes WCAG contrast in both modes, and persists to user profile & localStorage.',
  },
  {
    id: 'TC-11',
    title: 'Cloud Firestore Owner-Bound Access Isolation Verification',
    category: 'Security',
    preconditions: 'Two distinct Google user accounts exist.',
    steps: [
      'User A signs in and creates 3 reflections.',
      'User A signs out.',
      'User B signs in with a different Google account.',
      'User B inspects Timeline, Memory Threads, and Firestore listeners.',
    ],
    expectedResult:
      'User B sees zero of User A\'s reflections or threads. Firestore security rules reject any unauthorized cross-UID document read or write.',
  },
  {
    id: 'TC-12',
    title: 'Asynchronous UI State & Submit Guarding Under High Latency',
    category: 'Persistence',
    preconditions: 'User is interacting with the Reflection Editor.',
    steps: [
      'Type a reflection prompt and click "Reflect".',
      'Observe that the submit button disables immediately and shows an animated spinner.',
      'Attempt to click "Reflect" or press Enter while generation is active.',
      'Simulate an offline or network error and verify the error banner displays with a retry action.',
    ],
    expectedResult:
      'Duplicate submissions are prevented. The user input buffer is preserved during errors, and clear error recovery states are provided.',
  },
  {
    id: 'TC-13',
    title: 'Home Dashboard Navigation, Quick Check-in & Journey Cards',
    category: 'Timeline',
    preconditions: 'Authenticated user signs in to InnerAtlas.',
    steps: [
      'Observe initial landing view is the Home Dashboard with time-contextual greeting.',
      'Test Section A Quick Reflection buttons ("Open Reflection", "Problem Solving").',
      'Test Section B Today\'s Check-in mood selector (Great, Calm, Neutral, Stressed, Sad).',
      'Observe Section C Recent Reflection preview and Section D InnerAtlas Snapshot real metrics.',
      'Click any of the 4 Section E "Continue Your Journey" cards to navigate to respective workspaces.',
    ],
    expectedResult:
      'Dashboard aggregates real user Firestore data with zero mock placeholders and routes seamlessly to selected reflection tools.',
  },
  {
    id: 'TC-14',
    title: 'Collapsible Sidebar Navigation & Responsive Mobile Drawer',
    category: 'Theme',
    preconditions: 'User is navigating InnerAtlas on desktop and mobile viewports.',
    steps: [
      'On desktop, click the sidebar collapse toggle button (< / >).',
      'Verify sidebar transitions between expanded (labels) and compact (icons with tooltips) mode without layout breaks.',
      'Resize viewport to mobile/tablet (< 768px).',
      'Observe persistent 5-tab bottom navigation bar.',
      'Tap top hamburger icon to trigger slide-out mobile drawer with full links and account options.',
    ],
    expectedResult:
      'Smooth responsive layout adapts across all device widths with touch targets >= 44px and zero horizontal overflow.',
  },
  {
    id: 'TC-15',
    title: 'Personal Profile Verification & Firestore Security Display',
    category: 'Security',
    preconditions: 'Authenticated user clicks Profile in sidebar or user avatar in header.',
    steps: [
      'Navigate to the Profile tab.',
      'Verify displayed name, email, Google Avatar photo, and masked UID match auth token.',
      'Click the UID copy button and verify clipboard copy feedback.',
      'Inspect Growth Activity metrics calculated strictly from the user\'s Firestore records.',
      'Review the Zero-Trust Data Isolation statement.',
    ],
    expectedResult:
      'Profile information reflects only the active authenticated user with cryptographically isolated data guarantees.',
  },
  {
    id: 'TC-16',
    title: 'User Preferences & Settings Persistence in Cloud Firestore',
    category: 'Persistence',
    preconditions: 'User navigates to Settings tab.',
    steps: [
      'Select theme option: "Warm Light", "Serene Dark", or "System Match".',
      'Toggle "Reduced Motion" switch.',
      'Select a default reflection category (e.g. "Problem Solving" or "Gratitude").',
      'Verify settings are saved to /users/{userId} document in Firestore with success indicator.',
      'Start a new reflection and verify it defaults to the selected category.',
    ],
    expectedResult:
      'User preferences persist across sessions, devices, and browser restarts with zero undefined values sent to Firestore.',
  },
  {
    id: 'TC-17',
    title: 'Subjective Color Reflection Selection & Gentle AI Prompt Context',
    category: 'Reflection',
    preconditions: 'User is in the Reflection Editor.',
    steps: [
      'Locate the "Color Reflection (Subjective Feeling)" card below mood selection.',
      'Select a curated color swatch (e.g. "Sage Tranquility", "Amber Warmth", "Oceanic Depth").',
      'Alternatively open the custom HTML5 color picker to select an exact personalized hue.',
      'Observe the color badge rendered next to the reflection title.',
      'Submit a message to Gemini and review the AI response.',
    ],
    expectedResult:
      'The selected color hex and name are persisted with the entry. Gemini responds with gentle, non-diagnostic poetic reflections that honor the emotional atmosphere without psychological claims.',
  },
  {
    id: 'TC-18',
    title: 'Color Journey Visualizer & Chronological Color Spectrum',
    category: 'Timeline',
    preconditions: 'User has recorded multiple reflections with assigned colors.',
    steps: [
      'Navigate to Home Dashboard or Reflection Timeline.',
      'Locate the "Color Journey (Emotional Atmosphere)" visualizer card.',
      'Inspect the color spectrum bar and chronological color dots.',
      'Review color frequency percentages and breakdown.',
      'Click on a past reflection from the color journey to open it in the editor.',
    ],
    expectedResult:
      'Visualizes the user\'s unique emotional spectrum across time with clear, non-diagnostic framing and interactive navigation to color-tagged reflections.',
  },
  {
    id: 'TC-19',
    title: 'Warm Light Mode Visual Audit & Semantic Token Contrast',
    category: 'Theme',
    preconditions: 'User toggles theme to Light mode in header or settings.',
    steps: [
      'Toggle theme to "Warm Light" mode.',
      'Inspect canvas background (#FAFAF9 / stone-50), elevated cards (white with subtle stone borders), and typography.',
      'Verify that all text labels, headings, body text, and button labels have high contrast (meeting WCAG AA standards).',
      'Verify dark mode remains equally pristine without regressions.',
    ],
    expectedResult:
      'Light mode renders with an intentional warm editorial design, crisp dark typography, subtle neutral borders, and zero invisible or low-contrast elements.',
  },
];

export const TestingWalkthroughView: React.FC = () => {
  const [completedTests, setCompletedTests] = useState<Record<string, boolean>>({});

  const toggleTest = (id: string) => {
    setCompletedTests((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(completedTests).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / TEST_CASES.length) * 100);

  return (
    <div
      id="view-testing-walkthrough"
      className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-6 lg:px-8 transition-colors"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            <PlayCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Quality Assurance & Verification Suite</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mt-1">
            Functional Stability Walkthroughs
          </h1>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 max-w-2xl">
            Interactive test matrix covering every user interaction, mood flow, Memory Thread synthesis,
            Weekly Insight calculation, smart tags, onboarding, and security boundary across InnerAtlas.
          </p>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 shadow-xs">
          <div className="text-right">
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {completedCount} / {TEST_CASES.length} Verified
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400">{progressPercent}% Completed</div>
          </div>
          <div className="h-10 w-10 rounded-full border-4 border-amber-500/40 flex items-center justify-center font-bold text-xs text-amber-800 dark:text-amber-300">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="space-y-4">
        {TEST_CASES.map((tc) => {
          const isDone = Boolean(completedTests[tc.id]);
          return (
            <div
              key={tc.id}
              id={`card-testcase-${tc.id.toLowerCase()}`}
              className={`rounded-3xl border p-5 sm:p-6 transition ${
                isDone
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700 shadow-xs'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <button
                    id={`btn-check-testcase-${tc.id.toLowerCase()}`}
                    onClick={() => toggleTest(tc.id)}
                    className="mt-0.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
                  >
                    {isDone ? (
                      <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="h-5 w-5 text-stone-400 dark:text-stone-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                        {tc.id}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                        {tc.category}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                      {tc.title}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    isDone
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {isDone ? 'Verified' : 'Pending Verification'}
                </span>
              </div>

              {/* Body */}
              <div className="space-y-2.5 pl-8 text-xs text-stone-700 dark:text-stone-300">
                <div className="rounded-2xl bg-stone-50 dark:bg-stone-950/60 p-3 border border-stone-200/60 dark:border-stone-800">
                  <strong className="text-stone-900 dark:text-stone-100">Preconditions:</strong>{' '}
                  <span className="text-stone-600 dark:text-stone-400">{tc.preconditions}</span>
                </div>

                <div>
                  <strong className="text-stone-900 dark:text-stone-100 block mb-1">Execution Steps:</strong>
                  <ol className="list-decimal pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                    {tc.steps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 p-3 border border-amber-200/70 dark:border-amber-800/60 text-amber-950 dark:text-amber-200">
                  <strong className="text-amber-900 dark:text-amber-300">Expected Result:</strong>{' '}
                  <span>{tc.expectedResult}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
