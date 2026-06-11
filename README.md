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
