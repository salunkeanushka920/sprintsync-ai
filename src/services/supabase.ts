import { createClient } from '@supabase/supabase-js';

const cleanUrl = (url: string) => {
  if (!url) return '';
  return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
};

const DEFAULT_SUPABASE_URL = 'https://newjampgimgidqkbwjti.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ld2phbXBnaW1naWRxa2J3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODI0MzUsImV4cCI6MjEwMjM1ODQzNX0.xlhcS6tMmb9RZ9Sp_dWdz4o4YhRzuwnE7dRGMY9w1no';

const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const storageUrl = localStorage.getItem('sprintsync_supabase_url');
  const storageKey = localStorage.getItem('sprintsync_supabase_anon_key');

  const supabaseUrl = cleanUrl(envUrl || storageUrl || DEFAULT_SUPABASE_URL);
  const supabaseKey = (envKey || storageKey || DEFAULT_SUPABASE_KEY).trim();

  return { supabaseUrl, supabaseKey };
};

const { supabaseUrl, supabaseKey } = getSupabaseCredentials();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const setSupabaseCredentials = (url: string, key: string) => {
  const sanitized = cleanUrl(url);
  localStorage.setItem('sprintsync_supabase_url', sanitized);
  localStorage.setItem('sprintsync_supabase_anon_key', key.trim());
  window.location.reload();
};

export const SUPABASE_SQL_SCHEMA = `-- Copy & paste this SQL into Supabase SQL Editor to create tables for SprintSync AI:

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  department TEXT NOT NULL DEFAULT 'Frontend',
  avatar TEXT,
  bio TEXT,
  skills TEXT[],
  "githubUsername" TEXT,
  "linkedInUrl" TEXT,
  "phoneNumber" TEXT,
  "themePreference" TEXT DEFAULT 'dark',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'todo',
  "assignedToIds" TEXT[],
  "createdBy" TEXT,
  "startDate" TEXT,
  "dueDate" TEXT,
  "estimatedHours" NUMERIC DEFAULT 0,
  "actualHours" NUMERIC DEFAULT 0,
  tags TEXT[],
  "githubIssueUrl" TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  "blockerReason" TEXT,
  "progressNotes" TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Standups Table
CREATE TABLE IF NOT EXISTS public.standups (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "userAvatar" TEXT,
  date TEXT NOT NULL,
  yesterday TEXT,
  today TEXT,
  blockers TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  "taskId" TEXT
);

-- Enable Row Level Security (RLS) and allow public read/write for hackathon demo
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public read/write tasks" ON public.tasks FOR ALL USING (true);
CREATE POLICY "Allow public read/write standups" ON public.standups FOR ALL USING (true);
CREATE POLICY "Allow public read/write notifications" ON public.notifications FOR ALL USING (true);
`;
