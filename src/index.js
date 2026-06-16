require('dotenv').config();
const { generateResponse } = require('./ollama');
const { speak } = require('./voicevox');
const { getComments } = require('./youtube');
const { connect, triggerExpression } = require('./vtube');

const VIDEO_ID = 'ここに自分のYouTube動画IDを入れる';

let processedComments = new Set();
let isSpeaking = false;

async function processComments() {
  try {
    const comments = await getComments(VIDEO_ID);

    for (const comment of comments) {
      if (processedComments.has(comment.text)) continue;
      processedComments.add(comment.text);

      console.log(`\nコメント: ${comment.author}: ${comment.text}`);

      while (isSpeaking) {
        await new Promise(r => setTimeout(r, 500));
      }

      isSpeaking = true;

      // 返答生成
      const response = await generateResponse(comment.text);
      console.log(`返答: ${response}`);

      // 表情を変える
      await triggerExpression('happy.exp3.json');

      // 音声再生
      await speak(response);

      isSpeaking = false;
    }
  } catch (err) {
    console.error('エラー:', err.message);
  }
}

async function main() {
  console.log('AItuber起動中...');

  // VTube Studio接続
  await connect();

  setInterval(processComments, 10000);
}

main();