# Professor Connection Backend API

A backend API that helps students connect with professors by finding their contact information, research interests, and providing email templates.

## 🚀 Phase 1: Project Setup (Current)

✅ **Completed:**
- Node.js project initialized
- Express.js framework configured
- Basic server setup with middleware
- Project structure created
- Environment configuration

### Installation

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

The server will run on `http://localhost:3000` (or the PORT specified in .env)

### Project Structure

```
prof_webapp/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
└── package.json        # Dependencies and scripts
```

## 📋 Development Roadmap

### Phase 1: Project Setup ✅ (Current)
- [x] Initialize Node.js project
- [x] Install core dependencies (Express, dotenv, cors, helmet, morgan)
- [x] Create project folder structure
- [x] Set up basic Express server
- [x] Configure environment variables
- [x] Add security middleware (Helmet)
- [x] Add logging (Morgan)

### Phase 2: Database Setup
- [ ] Choose database (MongoDB/PostgreSQL/MySQL)
- [ ] Install database driver/ORM
- [ ] Configure database connection
- [ ] Set up database models/schemas
- [ ] Create migration scripts

### Phase 3: Professor Data Management
- [ ] Create Professor model/schema
- [ ] Implement CRUD operations for professors
- [ ] Add search functionality (by name, university, research area)
- [ ] Add filtering (by department, research interests)
- [ ] Implement data validation

### Phase 4: Research Interests & Contact Info
- [ ] Design schema for research interests
- [ ] Add contact information fields
- [ ] Implement data scraping/import (if needed)
- [ ] Add data enrichment features
- [ ] Create API endpoints for professor lookup

### Phase 5: Email Template System
- [ ] Create EmailTemplate model
- [ ] Design template structure
- [ ] Implement template CRUD operations
- [ ] Add template variables/placeholders
- [ ] Create template rendering engine

### Phase 6: Authentication & Authorization
- [ ] Set up authentication (JWT/OAuth)
- [ ] Implement user registration/login
- [ ] Add role-based access control
- [ ] Secure API endpoints
- [ ] Add rate limiting

### Phase 7: Advanced Features
- [ ] Add professor recommendation system
- [ ] Implement search history
- [ ] Add favorites/bookmarks
- [ ] Create email sending functionality
- [ ] Add analytics and tracking

### Phase 8: Testing & Deployment
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production
- [ ] Add monitoring and logging

## 🛠️ Technologies

- **Runtime:** Node.js
- **Framework:** Express.js
- **Security:** Helmet
- **Logging:** Morgan
- **Environment:** dotenv

## 📝 API Endpoints (Planned)

### Health Check
- `GET /health` - Server health status

### Professors (Phase 3-4)
- `GET /api/professors` - List all professors
- `GET /api/professors/:id` - Get professor by ID
- `GET /api/professors/search?q=query` - Search professors
- `POST /api/professors` - Create new professor entry
- `PUT /api/professors/:id` - Update professor
- `DELETE /api/professors/:id` - Delete professor

### Email Templates (Phase 5)
- `GET /api/email-templates` - List all templates
- `GET /api/email-templates/:id` - Get template by ID
- `POST /api/email-templates` - Create new template
- `PUT /api/email-templates/:id` - Update template
- `DELETE /api/email-templates/:id` - Delete template
- `POST /api/email-templates/:id/generate` - Generate email from template

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=development
```

## 📄 License

ISC

