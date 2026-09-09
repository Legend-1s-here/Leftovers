-- ==============================================================================
-- QuotaVerse: Supabase Database Table & Row-Level Security (RLS) Setup
-- Copy and paste this script into your Supabase Dashboard -> SQL Editor and click RUN
-- ==============================================================================

-- 1. Create the subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  account TEXT NOT NULL,
  account_tag TEXT,
  account_color TEXT,
  model TEXT NOT NULL,
  custom_model_name TEXT,
  plan TEXT,
  cost NUMERIC DEFAULT 0,
  billing_cycle TEXT DEFAULT 'monthly',
  started_date TEXT,
  renewal_date TEXT NOT NULL,
  session_reset_at TEXT,
  session_duration_hours INT DEFAULT 5,
  notes TEXT,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row-Level Security (RLS) so users only see their own subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.subscriptions;

-- 4. Create RLS Policies
CREATE POLICY "Users can view their own subscriptions" 
  ON public.subscriptions 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
  ON public.subscriptions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
  ON public.subscriptions 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" 
  ON public.subscriptions 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);
