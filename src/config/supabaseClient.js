// backend/src/config/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Verificação de segurança: Se as chaves não existirem no .env, o sistema avisa
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error("❌ ERRO: Variáveis SUPABASE_URL ou SUPABASE_KEY não encontradas no arquivo .env");
}

// Criamos o cliente apenas UMA vez usando as variáveis escondidas
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_KEY
);

module.exports = supabase;