const { supabase } = require('../supabase/supabaseClient');

/**
 * User signup with Supabase Auth
 */
const signup = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Email and password are required'
            });
        }

        // Create user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || ''
                }
            }
        });

        if (error) {
            return res.status(400).json({
                error: 'Signup failed',
                message: error.message
            });
        }

        res.status(201).json({
            message: 'User created successfully',
            user: data.user,
            session: data.session
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to create user'
        });
    }
};

/**
 * User login with email and password
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Email and password are required'
            });
        }

        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({
                error: 'Login failed',
                message: error.message
            });
        }

        res.status(200).json({
            message: 'Login successful',
            user: data.user,
            session: data.session
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to login'
        });
    }
};

/**
 * User logout
 */
const logout = async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return res.status(400).json({
                error: 'Logout failed',
                message: error.message
            });
        }

        res.status(200).json({
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to logout'
        });
    }
};

/**
 * Refresh access token
 */
const refresh = async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Refresh token is required'
            });
        }

        const { data, error } = await supabase.auth.refreshSession({
            refresh_token
        });

        if (error) {
            return res.status(401).json({
                error: 'Token refresh failed',
                message: error.message
            });
        }

        res.status(200).json({
            message: 'Token refreshed successfully',
            session: data.session
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to refresh token'
        });
    }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
    try {
        // User is attached by authMiddleware
        res.status(200).json({
            user: req.user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to get profile'
        });
    }
};

module.exports = {
    signup,
    login,
    logout,
    refresh,
    getProfile
};
