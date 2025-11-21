require('dotenv').config();
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Admin Client (needs SERVICE_ROLE_KEY to bypass RLS)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importData() {
    // 1. Check if file exists
    const fileName = 'professors.json'; // Put your JSON file here

    if (!fs.existsSync(fileName)) {
        console.error(`❌ Error: File '${fileName}' not found.`);
        console.log(`👉 Please create a '${fileName}' file with your data.`);
        process.exit(1);
    }

    // 2. Read and parse JSON
    console.log(`📖 Reading ${fileName}...`);
    const rawData = fs.readFileSync(fileName);
    let jsonData;

    try {
        jsonData = JSON.parse(rawData);
    } catch (e) {
        console.error('❌ Error: Invalid JSON format.');
        process.exit(1);
    }

    // Ensure it's an array
    const records = Array.isArray(jsonData) ? jsonData : [jsonData];
    console.log(`📊 Found ${records.length} records to import.`);

    // 3. Insert into Supabase
    const { data, error } = await supabase
        .from('professors')
        .insert(records)
        .select();

    if (error) {
        console.error('❌ Import failed:', error.message);
    } else {
        console.log(`✅ Successfully imported ${data.length} professors!`);
    }
}

importData();
