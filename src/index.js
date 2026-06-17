require('dotenv').config();
const { generateResponse } = require('./claude');
const { speak } = require('./voicevox');
const { getComments } = require('./youtube');
const { connect, triggerExpression } = require('./vtube');

const VIDEO_ID = 'cexekk60jII';

let processedComments = new Set();
let isSpeaking = false;

async function processComments() {
  try {
    const { comments, pollingInterval } = await getComments(VIDEO_ID);

    for (const comment of comments) {
      if (processedComments.has(comment.text)) continue;
      processedComments.add(comment.text);

      console.log(`\nコメント: ${comment.author}: ${comment.text}`);

      while (isSpeaking) {
        await new Promise(r => setTimeout(r, 500));
      }

      isSpeaking = true;
      const response = await generateResponse(comment.text);
      console.log(`返答: ${response}`);
      await speak(response);
      isSpeaking = false;
    }

    // APIが推奨する間隔で次のポーリング
    setTimeout(processComments, pollingInterval);
    console.log(`次のポーリングまで: ${pollingInterval}ms`);

  } catch (err) {
    console.error('エラー:', err.message);
    setTimeout(processComments, 5000);
  }
}

async function main() {
  console.log('AItuber起動中...');
  await connect();

  // 初回は過去コメントを全部スキップ
  const { comments } = await getComments(VIDEO_ID);
  comments.forEach(c => processedComments.add(c.text));
  console.log(`過去コメント ${comments.length} 件をスキップしました`);

  setTimeout(processComments, 5000);
}

main();