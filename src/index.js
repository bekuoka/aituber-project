const { generateResponse } = require('./ollama');
const { speak } = require('./voicevox');

async function main() {
  console.log('AItuber起動中...');

  const testComments = [
    'こんにちは！',
    '好きな食べ物は何ですか？',
    '今日の配信楽しみにしてたよ！'
  ];

  for (const comment of testComments) {
    console.log(`\nコメント: ${comment}`);

    // qwen3で返答生成
    const response = await generateResponse(comment);
    console.log(`返答: ${response}`);

    // VOICEVOXで音声化
    console.log('音声生成中...');
    await speak(response);
  }
}

main();