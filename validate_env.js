require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

console.log("🔍 Validating .env file...");

if (!url) {
    console.log("❌ SUPABASE_URL is missing");
} else if (url.includes('your-project') || url.includes('your_supabase_project_url')) {
    console.log("❌ SUPABASE_URL still has placeholder value: " + url);
} else if (!url.startsWith('http')) {
    console.log("❌ SUPABASE_URL must start with http:// or https://");
} else {
    console.log("✅ SUPABASE_URL looks valid");
}

if (!key) {
    console.log("❌ SUPABASE_ANON_KEY is missing");
} else if (key.includes('your_supabase_anon_key')) {
    console.log("❌ SUPABASE_ANON_KEY still has placeholder value");
} else {
    console.log("✅ SUPABASE_ANON_KEY looks valid");
}
