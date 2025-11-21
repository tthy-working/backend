const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getChatHistory,
    clearChatHistory,
    getProfessorOutreachSuggestions
} = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All chat routes require authentication
router.post('/message', authMiddleware, sendMessage);
router.get('/history', authMiddleware, getChatHistory);
router.delete('/history', authMiddleware, clearChatHistory);
router.get('/suggestions/:professor_id', authMiddleware, getProfessorOutreachSuggestions);

module.exports = router;
