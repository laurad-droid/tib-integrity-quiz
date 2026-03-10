# TI-B Integrity Self-Assessment Tool — Design Document

## Context

Transparency International Belgium (TIB) needs a web-based Integrity Self-Assessment tool that allows government officials, private sector organizations, and civil society groups to evaluate their organization's integrity posture. Belgium scored 69/100 on the 2025 Corruption Perceptions Index (CPI), and this tool lets organizations benchmark themselves against that score and EU peers. The tool produces a 0-100 integrity score, a visual comparison against EU CPI data, and tailored action-plan recommendations.

## Architecture

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with TI brand theme
- **Charts**: Recharts (radar, bar, comparison)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email + password)
- **Hosting**: Vercel
- **Config**: JSON files for questions, CPI data, recommendations
- **PDF Export**: @react-pdf/renderer

## TI Brand Colors

| Token | Hex | Usage |
|---|---|---|
| ti-navy | #002169 | Headers, trust elements |
| ti-yellow | #FFCD00 | Primary buttons, highlights |
| ti-accent | #004C97 | Secondary links |
| ti-gray | #636466 | Supporting text |
| ti-bg | #F8F9FA | Background |

## Data Model

**profiles**: id, organization_name, sector (government/private/ngo)
**assessments**: id, user_id, total_score, dimension_scores (JSONB), completed_at
**responses**: id, assessment_id, question_id, answer_value, points_earned

## Integrity Dimensions (weighted)

1. Leadership & Governance (0.20)
2. Anti-corruption Policies (0.20)
3. Transparency & Disclosure (0.18)
4. Whistleblower Protection (0.17)
5. Accountability & Oversight (0.15)
6. Stakeholder Engagement (0.10)

## Scoring

- Per-dimension: (earned points / max points) x 100
- Overall: weighted average of dimensions -> 0-100 scale
- Directly comparable to Belgium CPI (69/100)

## User Flow

1. Register (email, org name, sector)
2. Card-by-card assessment (Likert, Scenario, Yes/Partial/No)
3. Results: hero score + CPI comparison + radar chart + action plan
4. Dashboard: history + retake

## Routes

- / (landing), /auth/login, /auth/register
- /assessment (quiz), /results/[id] (SSR)
- /dashboard, /admin
