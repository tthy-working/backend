const express = require('express');
const router = express.Router();
const {
    generateEmail,
    getTemplateTypes,
    saveEmail,
    getUserEmails,
    getEmailById,
    updateEmailStatus,
    deleteEmail,
    getEmailStats,
    getEmailsByProfessor
} = require('../controllers/emailController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/generate', generateEmail);
router.get('/templates', getTemplateTypes);

// Protected routes (require authentication)
router.post('/', authMiddleware, saveEmail);
router.get('/user', authMiddleware, getUserEmails);
router.get('/stats', authMiddleware, getEmailStats);
router.get('/by-professor', authMiddleware, getEmailsByProfessor);
router.get('/:id', authMiddleware, getEmailById);
router.patch('/:id/status', authMiddleware, updateEmailStatus);
router.delete('/:id', authMiddleware, deleteEmail);

module.exports = router;
