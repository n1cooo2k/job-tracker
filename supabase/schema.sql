-- Job Application Tracker — database schema
-- Run this in the Supabase Dashboard > SQL Editor

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company text not null,
  role text not null,
  country text,
  city text,
  salary_range text,
  application_date date not null default current_date,
  status text not null default 'Applied'
    check (status in ('Applied', 'Interview', 'Offer', 'Rejected')),
  notes text,
  job_url text,
  created_at timestamptz not null default now()
);

create index if not exists job_applications_user_id_idx
  on public.job_applications (user_id);

-- Row Level Security: users can only see and manage their own rows
alter table public.job_applications enable row level security;

create policy "Users can view own applications"
  on public.job_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.job_applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.job_applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own applications"
  on public.job_applications for delete
  using (auth.uid() = user_id);
