const { supabase } = require('../supabase/supabaseClient');

/**
 * Save email tracking record
 */
const saveEmail = async (emailData) => {
    const { data, error } = await supabase
        .from('emails')
        .insert([emailData])
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to save email: ${error.message}`);
    }

    return data;
};

/**
 * Get all emails for a user
 */
const getEmailsByUser = async (userId, filters = {}) => {
    let query = supabase
        .from('emails')
        .select('*')
        .eq('user_id', userId);

    // Apply status filter if provided
    if (filters.status) {
        query = query.eq('status', filters.status);
    }

    // Apply professor filter if provided
    if (filters.professor_id) {
        query = query.eq('professor_id', filters.professor_id);
    }

    // Sort by created date (newest first)
    query = query.order('created_at', { ascending: false });

    // Pagination
    if (filters.limit) {
        const from = filters.offset || 0;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to get emails: ${error.message}`);
    }

    return data;
};

/**
 * Get a single email by ID
 */
const getEmailById = async (emailId, userId) => {
    const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('id', emailId)
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // Not found
        }
        throw new Error(`Failed to get email: ${error.message}`);
    }

    return data;
};

/**
 * Update email status
 */
const updateEmailStatus = async (emailId, userId, status, notes = null) => {
    const updateData = {
        status,
        updated_at: new Date().toISOString()
    };

    if (notes) {
        updateData.notes = notes;
    }

    // Update status-specific timestamps
    if (status === 'sent') {
        updateData.sent_at = new Date().toISOString();
    } else if (status === 'replied') {
        updateData.replied_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('emails')
        .update(updateData)
        .eq('id', emailId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update email status: ${error.message}`);
    }

    return data;
};

/**
 * Delete an email record
 */
const deleteEmail = async (emailId, userId) => {
    const { error } = await supabase
        .from('emails')
        .delete()
        .eq('id', emailId)
        .eq('user_id', userId);

    if (error) {
        throw new Error(`Failed to delete email: ${error.message}`);
    }

    return true;
};

/**
 * Get email statistics for a user
 */
const getEmailStats = async (userId) => {
    // Get all emails for the user
    const { data: allEmails, error } = await supabase
        .from('emails')
        .select('status')
        .eq('user_id', userId);

    if (error) {
        throw new Error(`Failed to get email stats: ${error.message}`);
    }

    // Calculate statistics
    const stats = {
        total: allEmails.length,
        draft: 0,
        sent: 0,
        replied: 0,
        no_response: 0
    };

    allEmails.forEach(email => {
        if (stats.hasOwnProperty(email.status)) {
            stats[email.status]++;
        }
    });

    // Calculate response rate
    stats.responseRate = stats.sent > 0
        ? ((stats.replied / stats.sent) * 100).toFixed(2)
        : 0;

    return stats;
};

/**
 * Get emails grouped by professor
 */
const getEmailsByProfessor = async (userId) => {
    const { data, error } = await supabase
        .from('emails')
        .select(`
      *,
      professors (
        id,
        name,
        email,
        university,
        department
      )
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Failed to get emails by professor: ${error.message}`);
    }

    // Group by professor
    const grouped = {};
    data.forEach(email => {
        const profId = email.professor_id;
        if (!grouped[profId]) {
            grouped[profId] = {
                professor: email.professors,
                emails: []
            };
        }
        grouped[profId].emails.push(email);
    });

    return Object.values(grouped);
};

module.exports = {
    saveEmail,
    getEmailsByUser,
    getEmailById,
    updateEmailStatus,
    deleteEmail,
    getEmailStats,
    getEmailsByProfessor
};
