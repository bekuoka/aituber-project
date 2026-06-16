require('dotenv').config();
const { generateResponse } = require('./ollama');
const { speak } = require('./voicevox');
const { getComments } = require('./youtube');

const VIDEO_ID = 'ここに自分のYouTube動画IDを入れる';

let processedComments = new Set(); // 処理済みコメントを記録
let isSpeaking = false; // 音声再生中フラグ

async function processComments() {
  try {
    const comments = await getComments(VIDEO_ID);

    for (const comment of comments) {
      // 処理済みコメントはスキップ
      if (processedComments.has(comment.text)) continue;
      processedComments.add(comment.text);

      console.log(`\nコメント: ${comment.author}: ${comment.text}`);

      // 音声再生中は待つ
      while (isSpeaking) {
        await new Promise(r => setTimeout(r, 500));
      }

      isSpeaking = true;
      const response = await generateResponse(comment.text);
      console.log(`返答: ${response}`);
      await speak(response);
      isSpeaking = false;
    }
  } catch (err) {
    console.error('エラー:', err.message);
  }
}

async function main() {
  console.log('AItuber起動中...');
  setInterval(processComments, 10000);
}

main();