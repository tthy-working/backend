const OpenAI = require('openai');
const { supabase } = require('../supabase/supabaseClient');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Send a chat message and get AI response
 */
const sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                message: 'Message is required'
            });
        }

        // Get chat history for context
        const { data: history } = await supabase
            .from('chat_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
            .limit(10);

        // Build conversation history
        const messages = [
            {
                role: 'system',
                content: `You are a helpful assistant for a professor search platform. You help students find professors, craft cold emails, and provide advice on reaching out to professors for research opportunities. Be professional, concise, and helpful.`
            }
        ];

        // Add previous messages for context
        if (history && history.length > 0) {
            history.forEach(msg => {
                messages.push({ role: 'user', content: msg.user_message });
                messages.push({ role: 'assistant', content: msg.ai_response });
            });
        }

        // Add current message
        messages.push({ role: 'user', content: message });

        // Add additional context if provided (e.g., professor info)
        if (context) {
            messages.push({
                role: 'system',
                content: `Additional context: ${JSON.stringify(context)}`
            });
        }

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: messages,
            temperature: 0.7,
            max_tokens: 500
        });

        const aiResponse = completion.choices[0].message.content;

        // Save to chat history
        await supabase.from('chat_history').insert([{
            user_id: userId,
            user_message: message,
            ai_response: aiResponse,
            created_at: new Date().toISOString()
        }]);

        res.status(200).json({
            success: true,
            data: {
                message: aiResponse,
                tokens_used: completion.usage.total_tokens
            }
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message || 'Failed to process chat message'
        });
    }
};

/**
 * Get chat history for a user
 */
const getChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 50, offset = 0 } = req.query;

        const { data, error } = await supabase
            .from('chat_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (error) {
            throw new Error(`Failed to get chat history: ${error.message}`);
        }

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get chat history'
        });
    }
};

/**
 * Clear chat history for a user
 */
const clearChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const { error } = await supabase
            .from('chat_history')
            .delete()
            .eq('user_id', userId);

        if (error) {
            throw new Error(`Failed to clear chat history: ${error.message}`);
        }

        res.status(200).json({
            success: true,
            message: 'Chat history cleared successfully'
        });
    } catch (error) {
        console.error('Clear chat history error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to clear chat history'
        });
    }
};

/**
 * Get AI suggestions for professor outreach
 */
const getProfessorOutreachSuggestions = async (req, res) => {
    try {
        const { professor_id } = req.params;

        // Get professor details
        const { data: professor, error } = await supabase
            .from('professors')
            .select('*')
            .eq('id', professor_id)
            .single();

        if (error || !professor) {
            return res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Professor not found'
            });
        }

        // Generate AI suggestions
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert advisor on academic outreach. Provide concise, actionable suggestions for reaching out to professors.'
                },
                {
                    role: 'user',
                    content: `Give me 3 tips for reaching out to Professor ${professor.name} who works on ${professor.research_interests} at ${professor.university}. Keep it brief and actionable.`
                }
            ],
            temperature: 0.7,
            max_tokens: 300
        });

        const suggestions = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            data: {
                professor: professor,
                suggestions: suggestions
            }
        });
    } catch (error) {
        console.error('Get outreach suggestions error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to get outreach suggestions'
        });
    }
};

module.exports = {
    sendMessage,
    getChatHistory,
    clearChatHistory,
    getProfessorOutreachSuggestions
};
