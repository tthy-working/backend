# Professor Search Backend

A comprehensive Node.js backend API for professor search with advanced filtering, email management, and AI-powered chat assistance.

## Features

- 🔐 **Authentication**: Supabase Auth integration with JWT tokens
- 🔍 **Advanced Search**: Multi-filter professor search with pagination and sorting
- 📧 **Email Management**: Template generation and email tracking
- 🤖 **AI Chat**: OpenAI-powered assistant for research outreach advice
- 📊 **Analytics**: Email statistics and search insights

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4
- **Environment**: dotenv

## Prerequisites

- Node.js (v16 or higher)
- Supabase account and project
- OpenAI API key

## Installation

1. **Clone and navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env` and fill in your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Supabase tables**:

   Create the following tables in your Supabase project:

   **professors table**:
   ```sql
   CREATE TABLE professors (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     email TEXT,
     university TEXT,
     department TEXT,
     research_interests TEXT,
     accepting_students BOOLEAN DEFAULT false,
     rating DECIMAL(3,2),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **emails table**:
   ```sql
   CREATE TABLE emails (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     professor_id UUID REFERENCES professors(id) ON DELETE CASCADE,
     subject TEXT NOT NULL,
     body TEXT NOT NULL,
     status TEXT DEFAULT 'draft',
     notes TEXT,
     sent_at TIMESTAMP,
     replied_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **chat_history table**:
   ```sql
   CREATE TABLE chat_history (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     user_message TEXT NOT NULL,
     ai_response TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

## Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get current user profile (protected)

### Search
- `GET /api/search/professors` - Search professors with filters
  - Query params: `query`, `department`, `university`, `research_area`, `accepting_students`, `min_rating`, `max_rating`, `page`, `limit`, `sort_by`, `sort_order`
- `GET /api/search/professors/:id` - Get professor by ID
- `GET /api/search/departments` - Get all departments
- `GET /api/search/universities` - Get all universities
- `GET /api/search/research-areas` - Get all research areas
- `GET /api/search/stats` - Get search statistics

### Email Management
- `POST /api/emails/generate` - Generate email from template
- `GET /api/emails/templates` - Get available template types
- `POST /api/emails` - Save email (protected)
- `GET /api/emails/user` - Get user's emails (protected)
- `GET /api/emails/stats` - Get email statistics (protected)
- `GET /api/emails/by-professor` - Get emails grouped by professor (protected)
- `GET /api/emails/:id` - Get email by ID (protected)
- `PATCH /api/emails/:id/status` - Update email status (protected)
- `DELETE /api/emails/:id` - Delete email (protected)

### AI Chat
- `POST /api/chat/message` - Send chat message (protected)
- `GET /api/chat/history` - Get chat history (protected)
- `DELETE /api/chat/history` - Clear chat history (protected)
- `GET /api/chat/suggestions/:professor_id` - Get AI outreach suggestions (protected)

## Example Requests

### Search Professors
```bash
curl "http://localhost:5000/api/search/professors?query=machine%20learning&department=Computer%20Science&accepting_students=true&page=1&limit=10"
```

### Generate Email
```bash
curl -X POST http://localhost:5000/api/emails/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cold_email",
    "data": {
      "professorName": "Smith",
      "studentName": "John Doe",
      "studentBackground": "I am a senior CS student...",
      "researchInterest": "Machine Learning",
      "professorResearch": "deep learning and neural networks"
    }
  }'
```

### Chat with AI
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "How should I approach a professor for research opportunities?"
  }'
```

## Project Structure

```
backend/
├── server.js                   # Main Express server
├── package.json                # Dependencies
├── .env                        # Environment variables
├── supabase/
│   └── supabaseClient.js       # Supabase configuration
├── controllers/
│   ├── authController.js       # Authentication logic
│   ├── searchController.js     # Search and filtering
│   ├── emailController.js      # Email management
│   └── chatController.js       # AI chat integration
├── middleware/
│   └── authMiddleware.js       # JWT verification
├── routes/
│   ├── authRoutes.js           # Auth endpoints
│   ├── searchRoutes.js         # Search endpoints
│   ├── emailRoutes.js          # Email endpoints
│   └── chatRoutes.js           # Chat endpoints
├── services/
│   ├── professorService.js     # Professor data operations
│   └── emailTrackerService.js  # Email tracking operations
└── utils/
    └── emailTemplates.js       # Email template generators
```

## Search Filters

The search endpoint supports the following filters:

- **query**: Text search across name, email, and research interests
- **department**: Filter by department
- **university**: Filter by university
- **research_area**: Filter by research area (partial match)
- **accepting_students**: Filter by availability (true/false)
- **min_rating**: Minimum rating (0-5)
- **max_rating**: Maximum rating (0-5)
- **page**: Page number for pagination (default: 1)
- **limit**: Results per page (default: 20)
- **sort_by**: Sort field (name, rating, department, university, created_at)
- **sort_order**: Sort direction (asc/desc)

## Email Status Values

- `draft`: Email saved but not sent
- `sent`: Email has been sent
- `replied`: Professor has replied
- `no_response`: No response received

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Security

- JWT tokens for authentication
- Row Level Security (RLS) in Supabase
- Environment variables for sensitive data
- CORS configuration
- Input validation

## Development

For development with auto-reload:
```bash
npm run dev
```

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
