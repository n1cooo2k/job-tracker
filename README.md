# Trackfolio — Job Application Tracker

A full-stack dashboard to track every job application, interview and offer in one place. Built with React + Vite, Tailwind CSS, Recharts and Supabase (Postgres + Auth with row-level security).

**Live demo:** [job-tracker-two-topaz.vercel.app](https://job-tracker-two-topaz.vercel.app)

## Features

- **Auth** — email/password signup and login with Supabase Auth; all app routes are protected.
- **Job Board** — add, edit and delete applications (company, role, country, city, salary range, date, status, notes, job URL), with live search and filters by status and country. Color-coded status badges: Applied (blue), Interview (yellow), Offer (green), Rejected (red).
- **Dashboard** — total applications, response rate, interview→offer conversion, applications per week (bar), status breakdown (pie), top countries (bar) and activity over time (line).
- **CSV export** — one click downloads all your data as a UTF-8 CSV that opens cleanly in Excel.
- **Security** — row-level security policies ensure each user can only read and write their own rows.
- Fully responsive: sidebar on desktop, icon rail on tablet, bottom nav on mobile.

## Tech stack

React 19 · Vite 7 · Tailwind CSS 4 · Recharts 3 · Supabase JS v2 · React Router 7

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it. This creates the `job_applications` table, an index, and the RLS policies.
3. (Optional) In **Authentication > Providers > Email**, disable "Confirm email" if you want signups to log in immediately without email verification.

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your credentials from **Project Settings > API**:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

The anon key is safe to expose in the browser — row-level security is what protects the data.

### 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173, sign up, and start tracking.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New Project** and import the repo. Vercel auto-detects Vite (build command `npm run build`, output `dist`).
3. Add the two environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) under **Settings > Environment Variables**.
4. Deploy. `vercel.json` already rewrites all routes to `index.html` so client-side routing works on refresh.

## Project structure

```
src/
  lib/supabase.js        Supabase client (reads env vars)
  context/AuthContext.jsx Session state + sign in/up/out
  hooks/useApplications.js CRUD against job_applications
  utils/stats.js          Chart + KPI aggregation helpers
  utils/csv.js            CSV export
  components/             Layout, modals, badges, icons
  pages/                  Auth, Board (CRUD), Dashboard (charts)
supabase/schema.sql       Table + RLS policies
```

## Database schema

Table `public.job_applications`: `id` (uuid PK), `user_id` (FK → `auth.users`, cascade delete), `company`, `role`, `country`, `city`, `salary_range`, `application_date` (date), `status` (`Applied` | `Interview` | `Offer` | `Rejected`, enforced by a CHECK constraint), `notes`, `job_url`, `created_at` (timestamptz). RLS restricts select/insert/update/delete to rows where `auth.uid() = user_id`.
