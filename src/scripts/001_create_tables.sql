-- Create admin_users table first (needed for RLS policies)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin list" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users AS a
      WHERE a.user_id = auth.uid()
    )
  );

-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Business Information
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  business_registration_number TEXT,
  business_address TEXT NOT NULL,
  business_city TEXT NOT NULL,
  business_state TEXT NOT NULL,
  business_zip TEXT NOT NULL,
  business_country TEXT NOT NULL DEFAULT 'US',
  
  -- Personal Information
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_date_of_birth DATE NOT NULL,
  
  -- Document URLs (stored in Supabase Storage)
  business_license_url TEXT,
  tax_id_document_url TEXT,
  proof_of_address_url TEXT,
  id_document_url TEXT,
  bank_statement_url TEXT,
  
  -- Status and metadata
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT status_check CHECK (status IN ('pending', 'submitted', 'approved', 'rejected'))
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for submissions
CREATE POLICY "Users can view their own submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON public.submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update all submissions" ON public.submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'update',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT message_type_check CHECK (message_type IN ('update', 'approval', 'rejection', 'request'))
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view messages for their submissions" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.submissions 
      WHERE submissions.id = messages.submission_id 
      AND submissions.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can create messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS submissions_user_id_idx ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS submissions_status_idx ON public.submissions(status);
CREATE INDEX IF NOT EXISTS messages_submission_id_idx ON public.messages(submission_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON public.admin_users(user_id);
