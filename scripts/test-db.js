const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually since we don't assume dotenv is installed
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

console.log('Testing connection to:', supabaseUrl);
console.log('Using Service Key starting with:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'None');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Attempt 1: Check if 'users' table exists
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Connection Failed:', error.message);
      console.error('Full Error:', JSON.stringify(error, null, 2));
      
      if (error.code === 'PGRST301') {
        console.error('👉 Hinton: Your Service Role Key seems invalid/expired (JWT issue).');
      } else if (error.message.includes('relation "users" does not exist')) {
        console.error('👉 Hint: The "users" table does not exist. Please run schema.sql.');
      }
      return;
    }

    console.log('✅ Connection Successful!');
    console.log('✅ "users" table exists.');
    console.log(`Current user count: ${count}`);

  } catch (err) {
    console.error('❌ Unexpected Error:', err.message);
  }
}

testConnection();
