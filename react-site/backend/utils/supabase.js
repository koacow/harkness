const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

module.exports = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);