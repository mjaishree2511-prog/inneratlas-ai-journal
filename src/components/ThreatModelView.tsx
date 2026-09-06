import React from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  Cpu,
  CheckCircle,
} from 'lucide-react';
import type { ThreatModelItem } from '../types';

const THREAT_MODEL_ITEMS: ThreatModelItem[] = [
  {
    zone: '1. Input Surfaces',
    scenario: 'User submits malicious payloads or prompt injection via reflection text fields, mood tags, or thread filters.',
    vulnerability: 'OWASP LLM01 / LLM02: Indirect Prompt Injection & Insecure Input Handling',
    countermeasure:
      'Defensive input ingestion with null-safe destructuring; typed schema parsing; prompts isolated into structured message objects with system-instruction boundaries and markdown sanitization.',
    owaspRef: 'OWASP LLM01 & LLM02',
    status: 'Enforced',
  },
  {
    zone: '2. Planning & Reasoning',
    scenario: 'AI model service disruption or rate limiting leading to reflection/memory thread failure.',
    vulnerability: 'OWASP LLM04: Model Denial of Service & API Outages',
    countermeasure:
      'Resilient Model Fallback Ladder (gemini-3.6-flash → gemini-3.1-flash-lite → gemini-flash-latest → gemini-3.7-flash) with automated exception recovery across all endpoints.',
    owaspRef: 'OWASP LLM04',
    status: 'Implemented',
  },
  {
    zone: '3. Tool Execution / API Gateway',
    scenario: 'Exposure of secret Gemini API credentials to client inspection or unauthorized proxy execution.',
    vulnerability: 'OWASP A02: Cryptographic Failures & Credential Leakage',
    countermeasure:
      'Server-Side Express proxy (/api/chat, /api/summarize, /api/memory-threads, /api/weekly-insight) where GEMINI_API_KEY is securely accessed from Secret Manager / server environment only.',
    owaspRef: 'OWASP Top 10 A02',
    status: 'Enforced',
  },
  {
    zone: '4. Memory & State',
    scenario: 'Cross-user data leakage in Memory Threads or Weekly Insights queries across Firestore.',
    vulnerability: 'OWASP A01: Broken Access Control & Insecure Direct Object References',
    countermeasure:
      'Cloud Firestore Security Rules enforce strict ownership: match /users/{userId}/interactions/{id} { allow read, write: if request.auth.uid == userId; }. All client queries scoped to current user UID.',
    owaspRef: 'OWASP Top 10 A01',
    status: 'Enforced',
  },
  {
    zone: '5. Inter-System Communication',
    scenario: 'Credential theft via weak password storage or session hijacking.',
    vulnerability: 'OWASP A07: Identification and Authentication Failures',
    countermeasure:
      'Firebase Authentication Google OAuth federation. Zero direct application storage of cleartext or hashed passwords.',
    owaspRef: 'OWASP Top 10 A07',
    status: 'Enforced',
  },
];

export const ThreatModelView: React.FC = () => {
  return (
    <div
      id="view-threat-model"
      className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-6 lg:px-8 transition-colors"
    >
      {/* Header */}
      <div className="mb-8 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Security & Threat Model Specifications</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mt-1">
          InnerAtlas Agentic Threat Model & Countermeasures
        </h1>
        <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-3xl">
          Structured scenario-driven analysis mapping the 5 Core Threat Zones to active security
          safeguards, Firestore access boundaries, Memory Threads isolation, and OWASP Top 10 LLM standards.
        </p>
      </div>

      {/* Threat Summary Table */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
        <div className="border-b border-stone-200/80 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/60 px-6 py-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-50">
            Threat Analysis & Mitigation Matrix
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
            <thead className="bg-stone-100/75 dark:bg-stone-800/60 text-[11px] font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Threat Zone</th>
                <th className="px-4 py-3">Scenario & Risk</th>
                <th className="px-4 py-3">Vulnerability Category</th>
                <th className="px-4 py-3">Implemented Countermeasure</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80 dark:divide-stone-800">
              {THREAT_MODEL_ITEMS.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition">
                  <td className="px-4 py-3.5 font-semibold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                    {item.zone}
                  </td>
                  <td className="px-4 py-3.5 text-stone-600 dark:text-stone-400 max-w-xs">{item.scenario}</td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-amber-900 dark:text-amber-300">
                    {item.vulnerability}
                  </td>
                  <td className="px-4 py-3.5 text-stone-700 dark:text-stone-300 leading-relaxed">
                    {item.countermeasure}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle className="h-3 w-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Architecture Deep Dive */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Firestore Security Rules */}
        <div className="rounded-3xl border border-stone-800 bg-stone-900 dark:bg-stone-950 p-6 text-stone-100 shadow-xs">
          <div className="flex items-center justify-between gap-2 border-b border-stone-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-stone-200">
                Deployed firestore.rules
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Active on Cloud</span>
          </div>
          <pre className="overflow-x-auto text-[11px] font-mono text-amber-200/90 leading-relaxed bg-stone-950/80 dark:bg-black/50 p-3.5 rounded-2xl border border-stone-800">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
        
      match /interactions/{interactionId} {
        allow read, write: if request.auth != null 
          && request.auth.uid == userId;
      }
    }
  }
}`}
          </pre>
        </div>

        {/* Gemini Server-Side Fallback Architecture */}
        <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-3 mb-3">
              <Cpu className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-50">
                Resilient Gemini Fallback Ladder
              </h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
              To guarantee high availability and prevent single-point failures, AI calls on{' '}
              <code>/api/chat</code>, <code>/api/memory-threads</code>, and <code>/api/weekly-insight</code> sequentially invoke models in priority order:
            </p>
            <ol className="space-y-2 text-xs text-stone-700 dark:text-stone-300 font-mono">
              <li className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60">
                <span className="font-bold text-amber-900 dark:text-amber-300">1.</span>
                <span>gemini-3.6-flash (Primary Processing)</span>
              </li>
              <li className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800/60 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-stone-600 dark:text-stone-400">2.</span>
                <span>gemini-3.1-flash-lite (High-Availability Fallback)</span>
              </li>
              <li className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800/60 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-stone-600 dark:text-stone-400">3.</span>
                <span>gemini-flash-latest (Dynamic Alias)</span>
              </li>
              <li className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800/60 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-stone-600 dark:text-stone-400">4.</span>
                <span>gemini-3.7-flash (Deep Reasoning Fallback)</span>
              </li>
            </ol>
          </div>

          <div className="mt-4 border-t border-stone-100 dark:border-stone-800 pt-3 text-[11px] text-stone-500 dark:text-stone-400">
            ✓ Strict undefined stripping & JSON sanitization applied prior to Firestore writes.
          </div>
        </div>
      </div>
    </div>
  );
};
