require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./supabase/supabaseClient');

// Import routes
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const emailRoutes = require('./routes/emailRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Professor Search API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/chat', chatRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Professor Search API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            search: '/api/search',
            emails: '/api/emails',
            chat: '/api/chat'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested endpoint does not exist',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        error: 'Internal server error',
        message: err.message || 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const startServer = async () => {
    try {
        // Test Supabase connection
        console.log('🔌 Testing Supabase connection...');
        await testConnection();

        // Start listening
        app.listen(PORT, () => {
            console.log('');
            console.log('═══════════════════════════════════════════════════');
            console.log(`🚀 Professor Search API Server`);
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API URL: http://localhost:${PORT}`);
            console.log('═══════════════════════════════════════════════════');
            console.log('');
            console.log('Available endpoints:');
            console.log(`  GET  /health                    - Health check`);
            console.log(`  POST /api/auth/signup           - User signup`);
            console.log(`  POST /api/auth/login            - User login`);
            console.log(`  GET  /api/search/professors     - Search professors`);
            console.log(`  POST /api/emails/generate       - Generate email template`);
            console.log(`  POST /api/chat/message          - Send chat message`);
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;
