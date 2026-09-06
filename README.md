# InnerAtlas: Private AI Reflections & Personal Growth Workspace

A production-grade, user-authenticated personal reflection and growth workspace powered by **Gemini 3.6 Flash**, **Firebase Authentication (Google OAuth)**, and **Cloud Firestore** with strict per-user document isolation.

---

## 🌟 Core Concept & Capabilities

- **Home Dashboard**: Natural time-based greeting, Quick Reflection starters, Today's Check-in mood flow, Recent Reflection preview, personal InnerAtlas snapshot metrics, Color Journey spectrum visualizer, and quick-access journey cards.
- **Color Reflection & Emotional Atmosphere**: Express feelings through curated subjective color swatches or a custom hex color palette with gentle, non-diagnostic AI poetic context.
- **Color Journey Retrospective**: Chronological color journey map and spectrum distribution across Home, Timeline, and Weekly Insight views.
- **Sleek Collapsible Navigation**: Persistent vertical sidebar on desktop with expanded/compact modes, responsive top header bar, and mobile bottom tab navigation with slide-over drawer.
- **Personal Mood Check-in**: Select and track emotional states (*Great, Calm, Neutral, Stressed, Sad*) persisted directly in Cloud Firestore with zero undefined fields.
- **Reflect Journal**: Multi-turn self-inquiry with Gemini 3.6 Flash structured reflections, category modes, and takeaways.
- **Reflection Timeline**: Chronological, tag-filtered timeline showing dates, mood badges, turns, and executive summaries.
- **Memory Threads Engine**: Discovers recurring themes, challenges, goals, emotional patterns, and growth milestones across the user's private journal archive.
- **Weekly Insight ("What changed beneath the surface this week?")**: Generates 7-day retrospective syntheses covering mindset shifts, wins, recurring bottlenecks, and thoughtful questions for the coming week.
- **Personal Profile View**: User avatar, authenticated identity, masked UID verification, growth metrics, and zero-trust data isolation statement.
- **Preferences & Settings**: Theme switcher (Warm Light, Serene Dark, System Match), Reduced Motion toggle, Default Reflection Category selection, and guided tour replay.
- **Google Federated Identity (Firebase Auth)**: Secure, passwordless authentication. Zero storage of passwords in custom application code.
- **Strict Firestore Isolation**: Enforces user-isolated paths (`/users/{userId}/interactions/{interactionId}`) with deployed security rules preventing cross-user data leakage.
- **Server-Side AI Gateway**: Express backend proxies all `@google/genai` calls to shield API credentials from browser inspection.
- **Resilient Model Fallback Ladder**: Primary `gemini-3.6-flash` with automatic failover to `gemini-3.1-flash-lite`, `gemini-flash-latest`, and `gemini-3.7-flash`.

---

## 🔒 Threat Model & Countermeasures (The 5 Threat Zones)

| Threat Zone | Scenario & Risk | Vulnerability Category | Implemented Countermeasure | OWASP Reference |
| :--- | :--- | :--- | :--- | :--- |
| **1. Input Surfaces** | Malicious payloads or prompt injection via reflection text fields, mood tags, or thread filters | Indirect Prompt Injection & Insecure Input | Client + server typed schema validation; isolated system-instruction framing; defensive payload deserialization. | OWASP LLM01, LLM02 |
| **2. Planning & Reasoning** | Gemini API rate limiting or temporary model downtime | Model Denial of Service & API Outages | Resilient Model Fallback Ladder (3.6 Flash → 3.1 Flash-Lite → 3.7 Flash) across all endpoints. | OWASP LLM04 |
| **3. Tool Execution / API Gateway** | API key leakage via client-side inspect | Cryptographic Failures & Key Exposure | Server-side Express proxy; `GEMINI_API_KEY` stored exclusively in Secret Manager / server environment. | OWASP Top 10 A02 |
| **4. Memory & State** | Cross-user data leakage in Memory Threads or Weekly Insights queries | Broken Access Control & IDOR | Owner-bound Firestore Security Rules (`request.auth.uid == userId`). All queries scoped to UID. | OWASP Top 10 A01 |
| **5. Inter-System Comm** | Password database breaches / token forgery | Identification & Authentication Failures | Delegated Google OAuth via Firebase Auth. Zero application password storage. | OWASP Top 10 A07 |

---

## 🛡️ Cloud Firestore Security Rules

Deploy the following owner-bound rules in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /interactions/{interactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /reflections/{reflectionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## 🚀 Deployment & Google Cloud Run Setup

### 1. Prerequisites & GCP API Activation
Enable Cloud Run, Secret Manager, and Firestore APIs:
```bash
gcloud services enable run.googleapis.com secretmanager.googleapis.com firestore.googleapis.com
```

### 2. Secret Manager Configuration
Securely store your Gemini API key in Google Cloud Secret Manager:
```bash
# Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant the default Cloud Run service account access to read the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Deploy to Google Cloud Run
Deploy the application container directly to Cloud Run:
```bash
gcloud run deploy inneratlas-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --set-env-vars NODE_ENV=production
```

### 4. Mandatory Campaign Labeling
Apply the verification label to register the service for automated challenge verification:
```bash
gcloud run services update inneratlas-app \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## 🧪 Verification & Test Walkthroughs

1. **Google Sign-In & Home Landing**: Open the application, click **"Continue with Google Account"**, complete popup auth, and verify redirection to the Home Dashboard.
2. **Home Dashboard & Quick Check-in**: Experience the natural time-based greeting, select a mood (*Great, Calm, Neutral, Stressed, Sad*), check your recent reflection, and view your personal InnerAtlas stats.
3. **Collapsible Sidebar Navigation**: Toggle desktop sidebar expanded/compact modes and test mobile responsive drawer.
4. **Multi-Turn AI Reflection**: Choose a focus mode, submit a prompt, and observe Gemini 3.6 Flash respond with structured insights and follow-up inquiry.
5. **Reflection Timeline**: Navigate to **"Timeline"** to review chronological entries with mood badges, turn counts, and category filters.
6. **Memory Threads**: Click **"Memory Threads"** to run pattern discovery across your private journal history. Click connected reflection titles to jump directly to any reflection.
7. **Weekly Insight**: Click **"Weekly Insight"** to analyze reflections from the past 7 days and review executive syntheses, emotional patterns, and guiding questions.
8. **Profile & Settings**: View authenticated identity details, copy UID, customize theme and reduced motion settings with instant Firestore synchronization.
9. **Firestore Isolation**: Confirm the live "Saved to Firestore" indicator. Verify in the Firebase Console that records are stored under `/users/{YOUR_UID}/interactions/{ID}`.
