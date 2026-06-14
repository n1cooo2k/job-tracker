-- Adds the "source" column to an existing job_applications table.
-- Run this once in the Supabase Dashboard > SQL Editor if your table was
-- created before the source field existed. New setups via schema.sql already
-- include it.

alter table public.job_applications add column if not exists source text;
