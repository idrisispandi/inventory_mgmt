const OpenAI = require('openai');
require('dotenv').config();

const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = openAIClient;
