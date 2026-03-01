// backend/src/config/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// No Railway, as variáveis vêm do process.env diretamente.
// Ajustamos para ler SUPABASE_ANON_KEY (como está no seu print do Railway)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

// Verificação de segurança amigável para o log do Railway
if (!supabaseUrl || !supabaseKey) {
    console.error("⚠️ ATENÇÃO: Variáveis do Supabase não detectadas. Verifique o painel do Railway.");
}

// Criamos o cliente usando as variáveis disponíveis no ambiente
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
