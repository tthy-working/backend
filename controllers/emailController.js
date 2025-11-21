const emailTemplates = require('../utils/emailTemplates');
const emailTrackerService = require('../services/emailTrackerService');

/**
 * Generate email from template
 */
const generateEmail = async (req, res) => {
    try {
        const { type, data } = req.body;

        if (!type || !data) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                message: 'Template type and data are required'
            });
        }

        const email = emailTemplates.generateEmailByType(type, data);

        res.status(200).json({
            success: true,
            data: email
        });
    } catch (error) {
        console.error('Generate email error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

/**
 * Get available template types
 */
const getTemplateTypes = async (req, res) => {
    try {
        const templates = emailTemplates.getTemplateTypes();

        res.status(200).json({
            success: true,
            data: templates
        });
    } catch (error) {
        console.error('Get template types error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get template types'
        });
    }
};

/**
 * Save email draft or sent email
 */
const saveEmail = async (req, res) => {
    try {
        const userId = req.user.id;
        const { professor_id, subject, body, status = 'draft', notes } = req.body;

        if (!professor_id || !subject || !body) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                message: 'Professor ID, subject, and body are required'
            });
        }

        const emailData = {
            user_id: userId,
            professor_id,
            subject,
            body,
            status,
            notes,
            created_at: new Date().toISOString()
        };

        const savedEmail = await emailTrackerService.saveEmail(emailData);

        res.status(201).json({
            success: true,
            data: savedEmail
        });
    } catch (error) {
        console.error('Save email error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to save email'
        });
    }
};

/**
 * Get all emails for the authenticated user
 */
const getUserEmails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, professor_id, limit, offset } = req.query;

        const filters = {
            status,
            professor_id,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined
        };

        const emails = await emailTrackerService.getEmailsByUser(userId, filters);

        res.status(200).json({
            success: true,
            data: emails
        });
    } catch (error) {
        console.error('Get user emails error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get emails'
        });
    }
};

/**
 * Get a single email by ID
 */
const getEmailById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const email = await emailTrackerService.getEmailById(id, userId);

        if (!email) {
            return res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Email not found'
            });
        }

        res.status(200).json({
            success: true,
            data: email
        });
    } catch (error) {
        console.error('Get email error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get email'
        });
    }
};

/**
 * Update email status
 */
const updateEmailStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                message: 'Status is required'
            });
        }

        const validStatuses = ['draft', 'sent', 'replied', 'no_response'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const updatedEmail = await emailTrackerService.updateEmailStatus(id, userId, status, notes);

        res.status(200).json({
            success: true,
            data: updatedEmail
        });
    } catch (error) {
        console.error('Update email status error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to update email status'
        });
    }
};

/**
 * Delete an email
 */
const deleteEmail = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        await emailTrackerService.deleteEmail(id, userId);

        res.status(200).json({
            success: true,
            message: 'Email deleted successfully'
        });
    } catch (error) {
        console.error('Delete email error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to delete email'
        });
    }
};

/**
 * Get email statistics
 */
const getEmailStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const stats = await emailTrackerService.getEmailStats(userId);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get email stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get email statistics'
        });
    }
};

/**
 * Get emails grouped by professor
 */
const getEmailsByProfessor = async (req, res) => {
    try {
        const userId = req.user.id;

        const grouped = await emailTrackerService.getEmailsByProfessor(userId);

        res.status(200).json({
            success: true,
            data: grouped
        });
    } catch (error) {
        console.error('Get emails by professor error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get emails by professor'
        });
    }
};

module.exports = {
    generateEmail,
    getTemplateTypes,
    saveEmail,
    getUserEmails,
    getEmailById,
    updateEmailStatus,
    deleteEmail,
    getEmailStats,
    getEmailsByProfessor
};
