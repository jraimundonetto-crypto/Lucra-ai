const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. CONFIGURAÇÃO DE CAPACIDADE (PRECISA VIR ANTES DE TUDO)
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. MIDDLEWARE DE TRAVA VIP (CORRIGIDO PARA NÃO DAR ERRO)
const checkTrialStatus = (req, res, next) => {
    // Tenta pegar o e-mail de vários lugares para não dar "undefined"
    const userEmail = 
        (req.body && req.body.emailUsuario) || 
        (req.headers['x-user-email']) || 
        "visitante";

    // Se for você, liberado total
    if (userEmail === "jraimundonetto@gmail.com") {
        return next();
    }
    
    // Se não for você, apenas segue (a trava final fica dentro de cada rota no ia.js)
    next();
};

// 3. IMPORTAÇÃO DAS ROTAS
const vendasRoutes = require('./routes/vendas');
const iaRoutes = require('./routes/ia');
const mercadoPagoWebhook = require('./routes/mercadoPagoWebhook'); 

// 4. DEFINIÇÃO DAS ROTAS (Aplicando a trava após o processamento do JSON)
app.use('/api/vendas', checkTrialStatus, vendasRoutes);
app.use('/api/ia', checkTrialStatus, iaRoutes);
app.use(mercadoPagoWebhook);

app.get('/', (req, res) => {
    res.json({ 
        status: "Online", 
        modulo: "LUCRAAÍ CORE + OPENAI",
        admin: "jraimundonetto@gmail.com"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    🔥 SISTEMA COMPLETO: http://localhost:${PORT}
    🧠 MOTOR OPENAI COM RECONHECIMENTO REGIONAL!
    🚀 PRONTO PARA PROCESSAMENTO.
    --------------------------------------
    `);
});