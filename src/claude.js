const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateResponse(comment) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    system: `あなたはAItuberです。
視聴者のコメントに対して明るく楽しく返答してください。
返答は短く2〜3文でまとめてください。`,
    messages: [
      { role: 'user', content: comment }
    ]
  });

  return response.content[0].text;
}

module.exports = { generateResponse };
