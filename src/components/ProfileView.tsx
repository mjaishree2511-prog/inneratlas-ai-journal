import React, { useState } from 'react';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Lock,
  Key,
  Copy,
  Check,
  PenLine,
  TrendingUp,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import type { JournalEntry, NavTabType, UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile | null;
  entries: JournalEntry[];
  setActiveTab: (tab: NavTabType) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  entries,
  setActiveTab,
  onLogout,
}) => {
  const [copiedUid, setCopiedUid] = useState(false);

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  // Activity calculation from real user entries
  const totalEntries = entries.length;
  const totalMessages = entries.reduce(
    (acc, entry) => acc + (entry.messages ? entry.messages.length : 0),
    0
  );
  const categoriesUsed = new Set(entries.map((e) => e.category)).size;

  const firstEntryDate =
    entries.length > 0
      ? new Date(
          Math.min(...entries.map((e) => e.createdAt || Date.now()))
        ).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Today';

  return (
    <div id="profile-view" className="w-full max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800/80 pb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Your Account & Profile
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
          Review your authenticated identity, session security credentials, and personal reflection statistics.
        </p>
      </div>

      {/* Main Profile Identity Card */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Large Avatar */}
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'Profile Photo'}
              referrerPolicy="no-referrer"
              className="h-24 w-24 rounded-full border-2 border-amber-400/80 dark:border-amber-600 object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-serif text-3xl font-bold border-2 border-amber-300 dark:border-amber-800 shadow-sm">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-10 w-10" />}
            </div>
          )}

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {user?.displayName || 'Reflective Soul'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{user?.email || 'No email associated'}</span>
                </p>
              </div>

              <span className="inline-flex items-center self-center sm:self-start gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Google Authenticated</span>
              </span>
            </div>

            {/* Account UID badge with copy capability */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 rounded-xl bg-stone-100 dark:bg-stone-800 px-3 py-1.5 text-xs text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                <Key className="h-3.5 w-3.5 text-stone-400" />
                <span className="font-mono text-[11px]">
                  UID: {user?.uid ? `${user.uid.slice(0, 10)}...${user.uid.slice(-6)}` : 'N/A'}
                </span>
                <button
                  id="btn-copy-uid"
                  onClick={handleCopyUid}
                  title="Copy full UID"
                  className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition ml-1"
                >
                  {copiedUid ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary Cards */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
          Personal Growth Activity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 mb-3">
              <PenLine className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase text-stone-400 dark:text-stone-500">
              Total Reflections
            </span>
            <p className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {totalEntries}
            </p>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Saved interactions
            </span>
          </div>

          <div className="p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 dark:bg-teal-400/10 text-teal-800 dark:text-teal-300 border border-teal-500/20 mb-3">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase text-stone-400 dark:text-stone-500">
              Total Messages
            </span>
            <p className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {totalMessages}
            </p>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Dialogue exchanges
            </span>
          </div>

          <div className="p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-800 dark:text-indigo-300 border border-indigo-500/20 mb-3">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase text-stone-400 dark:text-stone-500">
              Categories Explored
            </span>
            <p className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {categoriesUsed}
            </p>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Reflection modes
            </span>
          </div>

          <div className="p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 mb-3">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold uppercase text-stone-400 dark:text-stone-500">
              First Reflection
            </span>
            <p className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 mt-2 truncate">
              {firstEntryDate}
            </p>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Journey start date
            </span>
          </div>
        </div>
      </div>

      {/* Security & Data Isolation Assurance Box */}
      <div className="rounded-3xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/30 p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-950 dark:text-amber-200">
          <Lock className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0" />
          <h3 className="font-serif text-base font-bold">
            Zero-Trust Data Isolation Guarantee
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          Every thought, reflection, and mood check-in you create in InnerAtlas is bound exclusively to your user identity path (<code>/users/{user?.uid || 'uid'}/interactions/*</code>) through cryptographically enforced Cloud Firestore security rules. No other user or unauthorized request can read, list, or write to your personal journal.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('security')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700 px-3.5 py-2 text-xs font-bold text-amber-900 dark:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>View Full Threat Model & Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-transparent border border-stone-300 dark:border-stone-700 px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-800 transition"
          >
            <span>Manage Preferences</span>
          </button>
        </div>
      </div>

      {/* Sign Out CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
        <span className="text-xs text-stone-500 dark:text-stone-400">
          Ready to conclude your current reflective session?
        </span>
        <button
          id="btn-profile-logout"
          onClick={onLogout}
          className="rounded-2xl border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-950/40 px-5 py-2.5 text-xs font-bold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition"
        >
          Sign Out of InnerAtlas
        </button>
      </div>
    </div>
  );
};
