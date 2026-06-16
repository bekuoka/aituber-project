const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function speak(text, speakerId = 3) {
  // 音声クエリを作成
  const queryResponse = await fetch(
    `http://localhost:50021/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
    { method: 'POST' }
  );
  const query = await queryResponse.json();

  // 音声を合成
  const audioResponse = await fetch(
    `http://localhost:50021/synthesis?speaker=${speakerId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    }
  );

  // 音声ファイルを保存
  const audioBuffer = await audioResponse.arrayBuffer();
  const outputPath = path.join(__dirname, '../temp_audio.wav');
  fs.writeFileSync(outputPath, Buffer.from(audioBuffer));

  // 音声を再生
  exec(`afplay ${outputPath}`);
}

module.exports = { speak };