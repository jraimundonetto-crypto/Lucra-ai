// CONFIGURAÇÕES DE CONEXÃO (Públicas para o navegador)
const SUPABASE_URL = 'https://xrwacdjyfimjrduyqrdy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyd2FjZGp5ZmltanJkdXlxcmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODc5NDMsImV4cCI6MjA4NzM2Mzk0M30.GOnaC2SZr4fXQ9-n8OoeOGsDI2meTwSwR8_QgzKBtfg'; 

// Inicializa o cliente corretamente
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. FUNÇÃO PARA CRIAR CONTA OU ENTRAR
async function autenticar(email, password, modoLogin) {
    let result;
    try {
        if (modoLogin) {
            result = await _supabase.auth.signInWithPassword({ email, password });
        } else {
            result = await _supabase.auth.signUp({ 
                email, 
                password,
                options: { data: { created_at_app: new Date().toISOString() } }
            });
        }

        if (result.error) throw result.error;

        // Após logar, a função de checagem será chamada automaticamente ou via redirecionamento
        verificarTempoDeTeste(result.data.user);

    } catch (error) {
        alert("Erro na autenticação: " + error.message);
    }
}

// 2. REGRA DE ACESSO (CORRIGIDA PARA EVITAR O LOOP DE ATUALIZAÇÃO)
async function verificarTempoDeTeste(user) {
    if (!user) return;

    // Identifica em qual página o usuário está agora
    const path = window.location.pathname;
    const paginaAtual = path.split("/").pop();

    // --- REGRA DE OURO: ACESSO VITALÍCIO PARA VOCÊ ---
    if (user.email === 'jraimundonetto@gmail.com') {
        console.log("✅ Acesso Vitalício Confirmado.");
        
        // SÓ redireciona se você estiver na tela de login ou em uma pasta raiz sem nome de arquivo
        // Se você já estiver na index.html, o código NÃO faz nada (isso para o loop)
        if (paginaAtual === "login.html" || paginaAtual === "cadastro.html") {
            window.location.href = "index.html";
        }
        return; 
    }

    // Regra dos 3 dias para outros usuários
    const dataCriacao = new Date(user.created_at);
    const dataHoje = new Date();
    const diferencaDias = Math.floor((dataHoje - dataCriacao) / (1000 * 60 * 60 * 24));

    if (diferencaDias >= 3) {
        alert("⚠️ Seu período de teste expirou.");
        window.location.href = "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2790786fa9214fc6b75f50fae353c7ba"; 
    } else {
        // Se ainda está no prazo e tentando acessar login, manda para index
        if (paginaAtual === "login.html" || paginaAtual === "cadastro.html") {
            window.location.href = "index.html";
        }
    }
}

// 3. SAIR DO SISTEMA
async function logout() {
    await _supabase.auth.signOut();
    window.location.href = "login.html";
}