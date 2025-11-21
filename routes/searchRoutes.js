const express = require('express');
const router = express.Router();
const {
    searchProfessors,
    getProfessorById,
    getDepartments,
    getUniversities,
    getResearchAreas,
    getSearchStats
} = require('../controllers/searchController');
const { optionalAuth } = require('../middleware/authMiddleware');

// Search routes (public, but can be enhanced with auth)
router.get('/professors', optionalAuth, searchProfessors);
router.get('/professors/:id', optionalAuth, getProfessorById);

// Filter options routes
router.get('/departments', getDepartments);
router.get('/universities', getUniversities);
router.get('/research-areas', getResearchAreas);

// Statistics route
router.get('/stats', getSearchStats);

module.exports = router;
