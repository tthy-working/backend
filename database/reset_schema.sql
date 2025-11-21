-- ⚠️ RESET SCRIPT - THIS WILL DELETE ALL DATA ⚠️
-- Run this to fix "column does not exist" errors by starting fresh

-- Ensure required extension for uuid_generate_v4
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Drop existing tables (order matters due to foreign keys)
DROP TABLE IF EXISTS chat_history CASCADE;
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS professors CASCADE;
DROP TABLE IF EXISTS outreach_campaigns CASCADE; -- Added this just in case

-- 2. Re-create Professors Table
CREATE TABLE professors (
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

-- 3. Re-create Emails Table
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  professor_id UUID NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'replied', 'no_response')),
  notes TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_emails_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_emails_professor FOREIGN KEY (professor_id) REFERENCES professors(id) ON DELETE CASCADE
);

-- 4. Re-create Chat History Table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 5. Create Indexes
CREATE INDEX idx_professors_name ON professors(name);
CREATE INDEX idx_professors_department ON professors(department);
CREATE INDEX idx_professors_university ON professors(university);
CREATE INDEX idx_professors_search ON professors USING gin(to_tsvector('english', name || ' ' || COALESCE(research_interests, '')));

-- 6. Enable Row Level Security (RLS)
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- 7. Create Policies
-- Professors (Public Read)
CREATE POLICY "professors_public_select" ON professors FOR SELECT USING (true);

-- Emails (User Private) - use SELECT auth.uid()
CREATE POLICY "emails_user_select" ON emails FOR SELECT USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "emails_user_insert" ON emails FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "emails_user_update" ON emails FOR UPDATE USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "emails_user_delete" ON emails FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Chat History (User Private)
CREATE POLICY "chat_user_select" ON chat_history FOR SELECT USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "chat_user_insert" ON chat_history FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "chat_user_delete" ON chat_history FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- 8. Insert Sample Data
INSERT INTO professors (name, email, university, department, research_interests, accepting_students, rating) VALUES
  ('Dr. Jane Smith', 'jane.smith@university.edu', 'Stanford University', 'Computer Science', 'Machine Learning, Neural Networks, AI', true, 4.8),
  ('Dr. John Doe', 'john.doe@university.edu', 'MIT', 'Computer Science', 'Robotics, Computer Vision, Autonomous Systems', true, 4.5),
  ('Dr. Emily Chen', 'emily.chen@university.edu', 'UC Berkeley', 'Electrical Engineering', 'Signal Processing, IoT, Embedded Systems', false, 4.2);

-- Informational message (top-level SQL)
SELECT '✅ Database successfully reset and recreated!' AS message;
