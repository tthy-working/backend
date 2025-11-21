-- Professor Search Platform - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up all required tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFESSORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS professors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  university TEXT,
  department TEXT,
  research_interests TEXT,
  accepting_students BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  website TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_professors_name ON professors(name);
CREATE INDEX IF NOT EXISTS idx_professors_department ON professors(department);
CREATE INDEX IF NOT EXISTS idx_professors_university ON professors(university);
CREATE INDEX IF NOT EXISTS idx_professors_accepting ON professors(accepting_students);
CREATE INDEX IF NOT EXISTS idx_professors_rating ON professors(rating);

-- Full text search index
CREATE INDEX IF NOT EXISTS idx_professors_search ON professors 
  USING gin(to_tsvector('english', name || ' ' || COALESCE(research_interests, '')));

-- ============================================
-- EMAILS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  professor_id UUID REFERENCES professors(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'replied', 'no_response')),
  notes TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_emails_user ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_professor ON emails(professor_id);
CREATE INDEX IF NOT EXISTS idx_emails_status ON emails(status);
CREATE INDEX IF NOT EXISTS idx_emails_created ON emails(created_at DESC);

-- ============================================
-- CHAT HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_history(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Professors: Public read access
CREATE POLICY "Professors are viewable by everyone" 
  ON professors FOR SELECT 
  USING (true);

-- Professors: Only admins can insert/update/delete (optional - adjust as needed)
-- CREATE POLICY "Only admins can modify professors" 
--   ON professors FOR ALL 
--   USING (auth.jwt() ->> 'role' = 'admin');

-- Emails: Users can only see their own emails
CREATE POLICY "Users can view their own emails" 
  ON emails FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emails" 
  ON emails FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emails" 
  ON emails FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emails" 
  ON emails FOR DELETE 
  USING (auth.uid() = user_id);

-- Chat History: Users can only see their own chat history
CREATE POLICY "Users can view their own chat history" 
  ON chat_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" 
  ON chat_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history" 
  ON chat_history FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample professors
INSERT INTO professors (name, email, university, department, research_interests, accepting_students, rating) VALUES
  ('Dr. Jane Smith', 'jane.smith@university.edu', 'Stanford University', 'Computer Science', 'Machine Learning, Neural Networks, AI', true, 4.8),
  ('Dr. John Doe', 'john.doe@university.edu', 'MIT', 'Computer Science', 'Robotics, Computer Vision, Autonomous Systems', true, 4.5),
  ('Dr. Emily Chen', 'emily.chen@university.edu', 'UC Berkeley', 'Electrical Engineering', 'Signal Processing, IoT, Embedded Systems', false, 4.2),
  ('Dr. Michael Brown', 'michael.brown@university.edu', 'Carnegie Mellon', 'Computer Science', 'Natural Language Processing, Deep Learning', true, 4.9),
  ('Dr. Sarah Johnson', 'sarah.johnson@university.edu', 'Harvard University', 'Applied Mathematics', 'Optimization, Algorithms, Computational Biology', true, 4.6)
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for professors table
DROP TRIGGER IF EXISTS update_professors_updated_at ON professors;
CREATE TRIGGER update_professors_updated_at
  BEFORE UPDATE ON professors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for emails table
DROP TRIGGER IF EXISTS update_emails_updated_at ON emails;
CREATE TRIGGER update_emails_updated_at
  BEFORE UPDATE ON emails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE 'Tables created: professors, emails, chat_history';
  RAISE NOTICE 'RLS policies enabled for security';
  RAISE NOTICE 'Sample data inserted (if not exists)';
END $$;
