# Supabase Setup Guide

This guide will walk you through connecting your backend to Supabase and populating it with test data.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub (or create an account)
4. Click **"New Project"**
5. Fill in:
   - **Name**: `professor-search` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
6. Click **"Create new project"**
7. Wait 2-3 minutes for setup to complete

## Step 2: Get Your API Keys

Once your project is ready:

1. In the Supabase dashboard, click **"Settings"** (gear icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL** - Copy this
   - **anon public** key - Copy this
   - **service_role** key - Copy this (click "Reveal" first)

## Step 3: Configure Your `.env` File

Open your `.env` file and update it with your Supabase credentials:

```env
PORT=5000
NODE_ENV=development

# Supabase Configuration (REPLACE WITH YOUR ACTUAL VALUES)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration (Optional for now)
OPENAI_API_KEY=your_openai_api_key_here
```

> **Important**: Never commit the `.env` file to Git! It's already in `.gitignore`.

## Step 4: Create Database Tables

1. In Supabase dashboard, click **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. Copy the entire contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see: "Success. No rows returned"

This creates:
- ✅ `professors` table
- ✅ `emails` table
- ✅ `chat_history` table
- ✅ Indexes for performance
- ✅ Row Level Security policies

## Step 5: Verify Tables Were Created

1. Click **"Table Editor"** in the sidebar
2. You should see three tables:
   - `professors`
   - `emails`
   - `chat_history`

## Step 6: Add Fake Test Data

### Option A: Use the Automated Script (Recommended)

Run the data seeding script:

```bash
node database/seedData.js
```

This will create 50 fake professors with realistic data.

### Option B: Manual Insert via Supabase UI

1. Go to **Table Editor** → **professors**
2. Click **"Insert"** → **"Insert row"**
3. Fill in the fields manually
4. Click **"Save"**

### Option C: Run SQL Insert

In the SQL Editor, you can run:

```sql
INSERT INTO professors (name, email, university, department, research_interests, accepting_students, rating)
VALUES 
  ('Dr. Jane Smith', 'jane.smith@stanford.edu', 'Stanford University', 'Computer Science', 'Machine Learning, AI, Neural Networks', true, 4.8),
  ('Dr. John Doe', 'john.doe@mit.edu', 'MIT', 'Computer Science', 'Robotics, Computer Vision', true, 4.5);
```

## Step 7: Test the Connection

Start your server:

```bash
npm run dev
```

You should see:
```
✅ Supabase connected successfully
🚀 Professor Search API Server
📡 Server running on port 5000
```

## Step 8: Test API Endpoints

### Test Search (No Auth Required)

```bash
curl http://localhost:5000/api/search/professors
```

You should get a JSON response with your professors!

### Test Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "fullName": "Test User"
  }'
```

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check that your `.env` file has the correct keys
- Make sure there are no extra spaces
- Restart the server after updating `.env`

### Error: "relation 'professors' does not exist"
- You need to run the `database/schema.sql` in Supabase SQL Editor
- Make sure the query ran successfully

### Error: "Invalid API key"
- Double-check you copied the correct keys from Supabase
- Make sure you're using the anon key, not the service role key for SUPABASE_ANON_KEY

### Connection test shows warning
- This is normal if the `professors` table is empty
- Add some data using the seed script

## Next Steps

1. ✅ Supabase project created
2. ✅ API keys configured in `.env`
3. ✅ Database tables created
4. ✅ Test data added
5. ✅ Server running and connected
6. 🎯 Build your frontend!

## Useful Supabase Features

- **Table Editor**: View and edit data visually
- **SQL Editor**: Run custom queries
- **Authentication**: Manage users in the Auth section
- **API Docs**: Auto-generated API documentation
- **Logs**: View real-time database logs

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or ask me!
