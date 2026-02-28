const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// ROTA PARA REGISTRAR UMA NOVA VENDA
// Local: POST http://localhost:3000/api/vendas
router.post('/registrar', async (req, res) => {
    const { usuario_id, produto_nome, valor_venda, custo_produto } = req.body;

    const { data, error } = await supabase
        .from('vendas')
        .insert([
            { 
                usuario_id, 
                produto_nome, 
                valor_venda, 
                custo_produto 
            }
        ])
        .select();

    if (error) return res.status(400).json({ erro: error.message });
    
    res.json({ mensagem: "Venda registrada com sucesso!", dados: data });
});

// ROTA PARA LISTAR TODAS AS VENDAS DE UM USUÁRIO
router.get('/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;

    const { data, error } = await supabase
        .from('vendas')
        .select('*')
        .eq('usuario_id', usuarioId);

    if (error) return res.status(400).json({ erro: error.message });

    res.json(data);
});

module.exports = router;