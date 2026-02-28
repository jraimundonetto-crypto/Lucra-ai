const express = require('express');
const router = express.Router();
const openai = require('../config/openaiConfig');
const { SYSTEM_PROMPT } = require('../config/prompts');
const multer = require('multer');

// Configuração do Multer (Memória para imagens)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// E-MAIL DO ADMINISTRADOR (ACESSO VITALÍCIO)
const ADMIN_EMAIL = "jraimundonetto@gmail.com";

// 1. ROTA DO CONSULTOR (AGORA COM LOCALIZAÇÃO)
router.post('/consultor/:usuarioId', async (req, res) => {
    try {
        const { pergunta, emailUsuario, localizacao } = req.body;
        const cidadeEstado = localizacao || "Brasil";

        // REGRA DE ACESSO VITALÍCIO PARA VOCÊ
        if (emailUsuario !== ADMIN_EMAIL) {
            return res.status(403).json({ 
                erro: "Bloqueado", 
                resposta: "🔒 O Consultor Estratégico está disponível apenas no Plano PRO. Assine para liberar seu sócio 24h!" 
            });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: `${SYSTEM_PROMPT}. Considere que o negócio está em ${cidadeEstado}. Dê conselhos baseados na realidade econômica e fornecedores locais desta região.` 
                },
                { role: "user", content: pergunta }
            ],
            max_tokens: 1000,
        });

        res.json({ resposta: completion.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ erro: "Erro na consultoria estratégica regional." });
    }
});

// 2. ROTA DE MARKETING (AGORA COM GÍRIAS E COSTUMES LOCAIS)
router.post('/marketing/:usuarioId', async (req, res) => {
    try {
        const { promptMarketing, localizacao, emailUsuario } = req.body;
        const cidadeEstado = localizacao || "Brasil";

        // Trava simples para marketing (Você passa direto)
        if (emailUsuario !== ADMIN_EMAIL && !req.headers['x-pro-user']) {
             // Lógica de trava opcional aqui
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: `Você é um Copywriter especialista em vendas locais para o setor de gastronomia. O público-alvo está em ${cidadeEstado}. Use referências locais se apropriado para gerar conexão.` 
                },
                { role: "user", content: `Crie uma campanha de WhatsApp para: ${promptMarketing}` }
            ],
            max_tokens: 600,
        });

        res.json({ resposta: completion.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao gerar campanha regional." });
    }
});

// 3. ROTA DE ANÁLISE DE IMAGEM (BUSCA DE PREÇOS EM TEMPO REAL POR LOCALIZAÇÃO)
router.post('/analisar-pdf/:usuarioId', upload.single('cardapio'), async (req, res) => {
    try {
        const { localizacao } = req.body;
        const cidadeEstado = localizacao || "sua região";
        const base64Image = req.file.buffer.toString('base64');

        const response = await openai.chat.completions.create({
            model: "gpt-4o", 
            messages: [
                {
                    role: "system",
                    content: `Você é um Analista de Suprimentos e Engenheiro de Alimentos especialista em precificação.
                    
                    SUA TAREFA:
                    1. Identifique os produtos e preços no cardápio enviado.
                    2. Realize uma análise baseada no custo de atacado ATUALIZADO dos insumos especificamente em: ${cidadeEstado}.
                    3. Considere o custo de frete, impostos regionais e preços praticados por atacadistas locais (ex: CEASA da região, Makro, Atacadão local).
                    4. Calcule o Lucro Líquido Real descontando CMV e custos variáveis estimados para ${cidadeEstado}.
                    
                    RETORNE APENAS JSON:
                    {
                      "vencedor": "Nome do item (Margem %)",
                      "lucrativo": "Sobra real em R$",
                      "prejuizo_nome": "Item com margem perigosa",
                      "prejuizo_valor": "Quanto sobra desse item",
                      "analise_regional": "Explique brevemente por que esse custo está alto ou baixo em ${cidadeEstado} hoje."
                    }`
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: `Analise este cardápio considerando o mercado de ${cidadeEstado}.` },
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ]
                }
            ],
            response_format: { type: "json_object" }
        });

        const dadosIA = JSON.parse(response.choices[0].message.content);
        res.json({ status: "Sucesso", dados: dadosIA });

    } catch (err) {
        console.error("Erro na análise regional:", err);
        res.status(500).json({ erro: "Erro na análise de mercado em tempo real para sua localização." });
    }
});

module.exports = router;