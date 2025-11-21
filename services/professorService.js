const { supabase } = require('../supabase/supabaseClient');

/**
 * Search professors with advanced filtering
 */
const searchProfessors = async (filters) => {
    const {
        query,
        department,
        university,
        research_area,
        accepting_students,
        min_rating,
        max_rating,
        page = 1,
        limit = 20,
        sort_by = 'name',
        sort_order = 'asc'
    } = filters;

    // Start building query
    let queryBuilder = supabase
        .from('professors')
        .select('*', { count: 'exact' });

    // Text search (searches in name and research_interests)
    if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,research_interests.ilike.%${query}%,email.ilike.%${query}%`);
    }

    // Department filter
    if (department) {
        queryBuilder = queryBuilder.eq('department', department);
    }

    // University filter
    if (university) {
        queryBuilder = queryBuilder.eq('university', university);
    }

    // Research area filter (assumes research_interests is a text field)
    if (research_area) {
        queryBuilder = queryBuilder.ilike('research_interests', `%${research_area}%`);
    }

    // Accepting students filter
    if (accepting_students !== undefined) {
        queryBuilder = queryBuilder.eq('accepting_students', accepting_students);
    }

    // Rating range filter
    if (min_rating !== undefined) {
        queryBuilder = queryBuilder.gte('rating', min_rating);
    }
    if (max_rating !== undefined) {
        queryBuilder = queryBuilder.lte('rating', max_rating);
    }

    // Sorting
    const validSortFields = ['name', 'rating', 'department', 'university', 'created_at'];
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'name';
    const sortDirection = sort_order === 'desc' ? false : true; // true = ascending

    queryBuilder = queryBuilder.order(sortField, { ascending: sortDirection });

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    queryBuilder = queryBuilder.range(from, to);

    // Execute query
    const { data, error, count } = await queryBuilder;

    if (error) {
        throw new Error(`Database query failed: ${error.message}`);
    }

    return {
        professors: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
    };
};

/**
 * Get a single professor by ID
 */
const getProfessorById = async (id) => {
    const { data, error } = await supabase
        .from('professors')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // Not found
        }
        throw new Error(`Database query failed: ${error.message}`);
    }

    return data;
};

/**
 * Get all unique departments
 */
const getDepartments = async () => {
    const { data, error } = await supabase
        .from('professors')
        .select('department')
        .not('department', 'is', null);

    if (error) {
        throw new Error(`Database query failed: ${error.message}`);
    }

    // Extract unique departments
    const uniqueDepartments = [...new Set(data.map(item => item.department))].sort();
    return uniqueDepartments;
};

/**
 * Get all unique universities
 */
const getUniversities = async () => {
    const { data, error } = await supabase
        .from('professors')
        .select('university')
        .not('university', 'is', null);

    if (error) {
        throw new Error(`Database query failed: ${error.message}`);
    }

    // Extract unique universities
    const uniqueUniversities = [...new Set(data.map(item => item.university))].sort();
    return uniqueUniversities;
};

/**
 * Get all unique research areas
 * Note: This assumes research_interests is a comma-separated string
 */
const getResearchAreas = async () => {
    const { data, error } = await supabase
        .from('professors')
        .select('research_interests')
        .not('research_interests', 'is', null);

    if (error) {
        throw new Error(`Database query failed: ${error.message}`);
    }

    // Extract and flatten research areas
    const allAreas = data
        .flatMap(item => item.research_interests.split(','))
        .map(area => area.trim())
        .filter(area => area.length > 0);

    const uniqueAreas = [...new Set(allAreas)].sort();
    return uniqueAreas;
};

/**
 * Get search statistics
 */
const getSearchStats = async () => {
    // Get total count
    const { count: totalProfessors, error: countError } = await supabase
        .from('professors')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        throw new Error(`Database query failed: ${countError.message}`);
    }

    // Get accepting students count
    const { count: acceptingCount, error: acceptingError } = await supabase
        .from('professors')
        .select('*', { count: 'exact', head: true })
        .eq('accepting_students', true);

    if (acceptingError) {
        throw new Error(`Database query failed: ${acceptingError.message}`);
    }

    // Get average rating
    const { data: ratingData, error: ratingError } = await supabase
        .from('professors')
        .select('rating')
        .not('rating', 'is', null);

    if (ratingError) {
        throw new Error(`Database query failed: ${ratingError.message}`);
    }

    const avgRating = ratingData.length > 0
        ? ratingData.reduce((sum, item) => sum + item.rating, 0) / ratingData.length
        : 0;

    return {
        totalProfessors: totalProfessors || 0,
        acceptingStudents: acceptingCount || 0,
        averageRating: parseFloat(avgRating.toFixed(2)),
        departmentCount: (await getDepartments()).length,
        universityCount: (await getUniversities()).length
    };
};

module.exports = {
    searchProfessors,
    getProfessorById,
    getDepartments,
    getUniversities,
    getResearchAreas,
    getSearchStats
};
