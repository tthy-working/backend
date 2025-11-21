const express = require('express');
const router = express.Router();
const { signup, login, logout, refresh, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
