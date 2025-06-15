const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be set in environment variables');
}

// Enhanced client configuration
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, 
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'your-app-name/1.0.0'
    }
  }
});

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .limit(1);
      
    if (error) throw error;
    console.log('Supabase connected successfully');
  } catch (err) {
    console.error('Supabase connection test failed:', err.message);
    process.exit(1);
  }
}

testConnection();

module.exports = supabase;