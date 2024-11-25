const createClient = require('@supabase/supabase-js').createClient;
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export default supabase = createClient(supabaseUrl, supabaseKey);