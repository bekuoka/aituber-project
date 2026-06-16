const { Ollama } = require('ollama');

const ollama = new Ollama();

async function generateResponse(comment) {
  const response = await ollama.chat({
    model: 'qwen3',
    messages: [
      {
        role: 'system',
        content: `あなたはAItuberです。
        視聴者のコメントに対して明るく楽しく返答してください。
        返答は短く2〜3文でまとめてください。`
      },
      {
        role: 'user',
        content: comment
      }
    ]
  });

  return response.message.content;
}

module.exports = { generateResponse };