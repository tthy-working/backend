const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client for general use (respects RLS)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create admin client for service operations (bypasses RLS)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('professors').select('count', { count: 'exact', head: true });
    if (error) {
      console.warn('⚠️  Supabase connection test warning:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  testConnection
};
