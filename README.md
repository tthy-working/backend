# Professor Search Backend

Node.js backend for searching professors, managing emails, and AI chat.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Copy `.env.example` to `.env` and add your Supabase/OpenAI keys:
   ```bash
   cp .env.example .env
   ```

3. **Start Server**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:5000`

## 🔑 Key Endpoints

### Search
- `GET /api/search/professors` - Search with filters (query, department, etc.)
- `GET /api/search/departments` - List all departments

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Email & Chat
- `POST /api/emails/generate` - Generate cold emails
- `POST /api/chat/message` - Chat with AI assistant

## 📁 Project Structure

- **controllers/**: Request handlers (Auth, Search, Email, Chat)
- **routes/**: API route definitions
- **services/**: Business logic and database queries
- **database/**: SQL schema for Supabase
