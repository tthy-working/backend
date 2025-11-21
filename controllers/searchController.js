const professorService = require('../services/professorService');

/**
 * Search professors with advanced filtering
 * Supports: text search, department, university, rating, availability, pagination, sorting
 */
const searchProfessors = async (req, res) => {
    try {
        const {
            // Text search
            query,

            // Filters
            department,
            university,
            research_area,
            accepting_students,
            min_rating,
            max_rating,

            // Pagination
            page = 1,
            limit = 20,

            // Sorting
            sort_by = 'name',
            sort_order = 'asc'
        } = req.query;

        // Build filter object
        const filters = {
            query,
            department,
            university,
            research_area,
            accepting_students: accepting_students === 'true' ? true : accepting_students === 'false' ? false : undefined,
            min_rating: min_rating ? parseFloat(min_rating) : undefined,
            max_rating: max_rating ? parseFloat(max_rating) : undefined,
            page: parseInt(page),
            limit: parseInt(limit),
            sort_by,
            sort_order
        };

        // Get professors from service
        const result = await professorService.searchProfessors(filters);

        res.status(200).json({
            success: true,
            data: result.professors,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error('Search professors error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to search professors'
        });
    }
};

/**
 * Get a single professor by ID
 */
const getProfessorById = async (req, res) => {
    try {
        const { id } = req.params;

        const professor = await professorService.getProfessorById(id);

        if (!professor) {
            return res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Professor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: professor
        });
    } catch (error) {
        console.error('Get professor error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get professor'
        });
    }
};

/**
 * Get all unique departments
 */
const getDepartments = async (req, res) => {
    try {
        const departments = await professorService.getDepartments();

        res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get departments'
        });
    }
};

/**
 * Get all unique universities
 */
const getUniversities = async (req, res) => {
    try {
        const universities = await professorService.getUniversities();

        res.status(200).json({
            success: true,
            data: universities
        });
    } catch (error) {
        console.error('Get universities error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get universities'
        });
    }
};

/**
 * Get all unique research areas
 */
const getResearchAreas = async (req, res) => {
    try {
        const researchAreas = await professorService.getResearchAreas();

        res.status(200).json({
            success: true,
            data: researchAreas
        });
    } catch (error) {
        console.error('Get research areas error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get research areas'
        });
    }
};

/**
 * Get search statistics
 */
const getSearchStats = async (req, res) => {
    try {
        const stats = await professorService.getSearchStats();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get search stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get search statistics'
        });
    }
};

module.exports = {
    searchProfessors,
    getProfessorById,
    getDepartments,
    getUniversities,
    getResearchAreas,
    getSearchStats
};
