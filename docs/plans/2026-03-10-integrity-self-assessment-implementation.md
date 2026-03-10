# TI-B Integrity Self-Assessment Tool — Design & Implementation Plan

## Context

Transparency International Belgium (TIB) needs a web-based Integrity Self-Assessment tool that allows government officials, private sector organizations, and civil society groups to evaluate their organization's integrity posture. Belgium scored 69/100 on the 2025 Corruption Perceptions Index (CPI), and this tool lets organizations benchmark themselves against that score and EU peers. The tool produces a 0-100 integrity score, a visual comparison against EU CPI data, and tailored action-plan recommendations.

This is a greenfield project. The project directory currently contains 5 research PDFs (CPI reports, Belgium country chapter, Global Integrity Pacts, behavioral insights on integrity indicators) but no application code.

---

## Architecture

```
User Browser → Next.js Frontend (Card UI + Tailwind/TI brand)
             → Next.js API Routes
             → Supabase (PostgreSQL + Auth)
             → Static JSON (questions, CPI data, recommendations)
```

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS with TI brand theme |
| Charts | Recharts (radar, bar, comparison) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + password) |
| Hosting | Vercel |
| Config | JSON files for questions, CPI data, recommendations |
| PDF Export | `@react-pdf/renderer` |

---

## TI Brand Design System

### Colors (Tailwind custom theme)
| Token | Hex | Usage |
|---|---|---|
| `ti-navy` | `#002169` | Headers, trust elements, primary text |
| `ti-yellow` | `#FFCD00` | Primary buttons, highlights, stagnation data |
| `ti-accent` | `#004C97` | Secondary links, UI accents |
| `ti-gray` | `#636466` | Supporting text, borders |
| `ti-bg` | `#F8F9FA` | Page background |

### Typography
- **Headlines**: Inter Bold (sans-serif)
- **Body**: Inter Regular/Medium

### Score Color Scale
- Red: score < 40
- Orange: 40-59
- Yellow: 60-74
- Green: 75+

---

## Data Model

### Supabase Tables

**profiles** (extends Supabase Auth)
- `id` (UUID, FK to auth.users)
- `organization_name` (text)
- `sector` (enum: government | private | ngo)
- `created_at` (timestamp)

**assessments**
- `id` (UUID, PK)
- `user_id` (UUID, FK to profiles)
- `total_score` (integer, 0-100)
- `dimension_scores` (JSONB, e.g., `{"transparency": 74, "accountability": 62}`)
- `completed_at` (timestamp)

**responses**
- `id` (UUID, PK)
- `assessment_id` (UUID, FK to assessments)
- `question_id` (text, matches config file)
- `answer_value` (text)
- `points_earned` (integer)

### Static Config Files (in repo)

**`/config/questions.json`** — array of question objects:
```json
{
  "id": "ldr-01",
  "dimension": "leadership",
  "type": "likert" | "scenario" | "yes_partial_no",
  "text": "Our organization has a formal code of conduct...",
  "maxPoints": 10,
  "weight": 1.0,
  "options": [
    { "label": "Strongly Disagree", "value": 1, "points": 0 },
    { "label": "...", "value": 5, "points": 10 }
  ]
}
```

**`/config/cpi-scores.json`** — EU country CPI scores:
```json
{ "BE": { "name": "Belgium", "score": 69 }, "DK": { "name": "Denmark", "score": 90 }, ... }
```

**`/config/dimensions.json`** — dimension definitions with weights:
```json
[
  { "id": "leadership", "label": "Leadership & Governance", "weight": 0.20 },
  { "id": "anticorruption", "label": "Anti-corruption Policies", "weight": 0.20 },
  { "id": "transparency", "label": "Transparency & Disclosure", "weight": 0.18 },
  { "id": "whistleblower", "label": "Whistleblower Protection", "weight": 0.17 },
  { "id": "accountability", "label": "Accountability & Oversight", "weight": 0.15 },
  { "id": "stakeholder", "label": "Stakeholder Engagement", "weight": 0.10 }
]
```

**`/config/recommendations.json`** — mapped to dimensions + score ranges:
```json
{
  "whistleblower": {
    "low": ["Establish a formal reporting channel", "Adopt anti-retaliation policy"],
    "medium": ["Train managers on handling reports", "Publish annual whistleblower statistics"],
    "high": ["Benchmark against EU Whistleblower Directive requirements"]
  }
}
```

---

## Scoring Logic

1. Each question has `maxPoints` and each answer option maps to a point value
2. Per-dimension score = (sum of points earned in dimension / sum of maxPoints in dimension) × 100
3. Dimensions have configurable weights (sum to 1.0)
4. **Overall score** = weighted average of dimension scores → 0-100 scale
5. This directly compares to Belgium's CPI score (69/100) and other EU countries

---

## User Flow

### 1. Registration
- Email + password via Supabase Auth
- Collect: organization name, sector (Government / Private / NGO)

### 2. Assessment (Card-by-Card Flow)
- Welcome card → explains purpose, ~15 min estimate, what you'll receive
- One question per card, full-width, centered
- Progress bar at top (card X of Y)
- Three card types:
  - **Likert**: statement + 5-point scale
  - **Scenario**: situation + 3-4 maturity-level options
  - **Yes/Partial/No**: compliance question + 3 buttons
- Smooth slide transitions between cards
- Auto-save on each answer (can quit and resume)
- Back/Next navigation

### 3. Results Page
- **Hero score**: large animated number with color indicator
- **CPI Comparison Bar Chart**: your score vs Belgium (69) vs EU average, with sortable EU country list
- **Dimension Radar Chart**: sub-scores across 6 dimensions (Recharts)
- **Action Plan**: for each dimension below 60/100, show 2-3 tailored recommendations
- **Export**: download PDF report, shareable link (SSR via Next.js)

### 4. Dashboard (returning users)
- View past assessment results
- Retake assessment to track progress

---

## Admin Dashboard (`/admin`, protected route)

- **Aggregate analytics**: total assessments, average scores by sector, score distribution
- **CPI context**: Belgium's CPI trend alongside aggregate user scores
- **Export**: anonymized aggregate data as CSV
- Questions/scoring managed in config files (developer updates)
- Access restricted to TIB staff accounts (role-based in Supabase)

---

## Pages & Routes

| Route | Purpose |
|---|---|
| `/` | Landing page with CTA |
| `/auth/login` | Login |
| `/auth/register` | Registration (email, org, sector) |
| `/assessment` | Card-by-card quiz flow |
| `/results/[id]` | Results page (SSR for sharing) |
| `/dashboard` | User's assessment history |
| `/admin` | TIB admin analytics |

---

## Implementation Plan

### Phase 1: Project Setup & Auth
- Initialize Next.js 14 project with App Router
- Configure Tailwind CSS with TI brand theme
- Set up Supabase project (database + auth)
- Create database tables and RLS policies
- Build registration and login pages
- Create protected route middleware

### Phase 2: Assessment Engine
- Create question config files (questions.json, dimensions.json)
- Build card component system (LikertCard, ScenarioCard, YesPartialNoCard)
- Implement card flow with state management and auto-save
- Build progress tracking and resume capability
- Add smooth card transitions and animations

### Phase 3: Scoring & Results
- Implement scoring calculation (weighted dimension scores)
- Create CPI comparison data file
- Build results page with:
  - Animated score reveal
  - CPI comparison bar chart (Recharts)
  - Dimension radar chart (Recharts)
  - Action plan section
- Implement PDF export
- SSR for shareable result links

### Phase 4: Admin & Polish
- Build admin dashboard with aggregate analytics
- Add CSV export for anonymized data
- Create recommendations config and mapping
- Mobile responsiveness pass
- Error handling and loading states
- i18n infrastructure (for future FR/NL support)

---

## Verification

### Manual Testing
1. Register a new account → verify profile created in Supabase
2. Complete full assessment → verify all responses saved
3. Check results page → score matches manual calculation
4. Compare score against CPI bar chart → Belgium at 69, your score highlighted
5. Verify radar chart shows all 6 dimensions
6. Download PDF → verify it contains score, dimensions, recommendations
7. Share result link → verify SSR renders correctly for non-logged-in viewers
8. Log in as admin → verify aggregate analytics display
9. Mobile test → verify card flow works on small screens

### Automated Testing
- Unit tests for scoring calculation logic
- Component tests for card types (render, answer selection, point mapping)
- Integration tests for assessment save/resume flow
- E2E test for full registration → assessment → results flow

---

## Key Files to Create

```
/app/
  layout.tsx                    # Root layout with TI branding
  page.tsx                      # Landing page
  /auth/login/page.tsx          # Login
  /auth/register/page.tsx       # Registration
  /assessment/page.tsx          # Card-based quiz
  /results/[id]/page.tsx        # Results (SSR)
  /dashboard/page.tsx           # User history
  /admin/page.tsx               # Admin analytics
  /api/assessments/route.ts     # Save/retrieve assessments
  /api/admin/analytics/route.ts # Aggregate data for admin

/components/
  /cards/
    LikertCard.tsx
    ScenarioCard.tsx
    YesPartialNoCard.tsx
    WelcomeCard.tsx
    CardFlow.tsx                # Orchestrates card navigation
  /results/
    ScoreHero.tsx
    CPIComparisonChart.tsx
    DimensionRadar.tsx
    ActionPlan.tsx
    ResultsPDF.tsx
  /admin/
    AnalyticsDashboard.tsx
  /ui/
    ProgressBar.tsx
    Button.tsx
    Card.tsx

/config/
  questions.json
  dimensions.json
  cpi-scores.json
  recommendations.json

/lib/
  supabase.ts                  # Supabase client
  scoring.ts                   # Score calculation logic
  auth.ts                      # Auth helpers

/tailwind.config.ts            # TI brand theme
```
