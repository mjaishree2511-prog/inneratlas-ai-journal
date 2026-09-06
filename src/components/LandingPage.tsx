import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  GitMerge,
  Calendar,
  Smile,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onSignIn: () => Promise<void>;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      await onSignIn();
    } catch (err: any) {
      console.error('Sign in error:', err);
      setAuthError(
        err.message ||
          'Failed to complete Google Sign-In. Please ensure popups are allowed or try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="view-landing-page"
      className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors"
    >
      {/* Hero Section */}
      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 px-3.5 py-1 text-xs font-semibold text-amber-900 dark:text-amber-300 mb-6 shadow-xs">
            <Compass className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
            <span>InnerAtlas • Private AI Reflections & Personal Growth</span>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-5xl lg:text-6xl">
            Understand the recurring patterns of your inner journey.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-stone-600 dark:text-stone-300 sm:text-lg leading-relaxed">
            A private, secure workspace for multi-turn reflections, personal mood check-ins,
            Memory Threads pattern discovery, and Weekly Insight retrospectives.
          </p>

          {authError && (
            <div className="mx-auto mt-6 max-w-md rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/60 p-4 text-left text-sm text-red-800 dark:text-red-300 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Notice</p>
                <p className="mt-1 text-xs text-red-700 dark:text-red-400">{authError}</p>
              </div>
            </div>
          )}

          {/* Call to action */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              id="btn-google-sign-in-hero"
              onClick={handleSignIn}
              disabled={isLoading}
              className="flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-stone-900 dark:bg-amber-600 px-7 py-3.5 text-base font-bold text-white shadow-md hover:bg-stone-800 dark:hover:bg-amber-500 active:scale-[0.99] transition disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isLoading ? 'Signing In...' : 'Continue with Google Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
            🔒 Your reflections belong to you. Insights are generated only from your private journal history.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 mb-4 border border-amber-200/60 dark:border-amber-800/60">
              <Smile className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-50 text-lg">
              Mood Check-ins & AI Reflections
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Track daily emotions (Great, Calm, Neutral, Stressed, Sad) with multi-turn conversations guided by Gemini 3.6 Flash.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 mb-4 border border-purple-200/60 dark:border-purple-800/60">
              <GitMerge className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-50 text-lg">
              Memory Threads Analysis
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Synthesize recurring themes, challenges, goals, and emotional milestones across your entire personal journal archive.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 mb-4 border border-teal-200/60 dark:border-teal-800/60">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-50 text-lg">
              Weekly Retrospective Insights
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              "What changed beneath the surface this week?" — Discover mindset shifts, personal triumphs, and reflective guiding questions.
            </p>
          </div>
        </div>

        {/* Security & Architecture Highlights */}
        <div className="mt-12 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Privacy & Security Architecture
              </span>
              <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-50 mt-1">
                Zero-Trust Firestore Isolation
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              OWASP Top 10 Enforced
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>User-Isolated Firestore:</strong> Enforced by rules (<code>request.auth.uid == userId</code>). No user can access another's data.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Server-Side Proxy:</strong> Gemini API keys remain confidential in backend Secret Manager environment.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Resilient Model Fallback Ladder:</strong> Automatic retry across 3.6 Flash, 3.1 Flash-Lite, and 3.7 Flash.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Responsible AI:</strong> Focused on mindful self-inquiry with zero medical or diagnostic claims.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 transition-colors">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-stone-500 dark:text-stone-400 sm:px-6">
          <p>
            InnerAtlas • Private AI Reflections & Personal Growth • Powered by Gemini & Cloud Firestore
          </p>
        </div>
      </footer>
    </div>
  );
};
