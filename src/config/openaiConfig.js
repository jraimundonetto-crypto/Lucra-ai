const { OpenAI } = require("openai");
require("dotenv").config();

// Inicialização profissional da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;