require('dotenv').config();
const { google } = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

async function getLiveChatId(videoId) {
  const response = await youtube.videos.list({
    part: ['liveStreamingDetails'],
    id: [videoId]
  });
  return response.data.items[0]?.liveStreamingDetails?.activeLiveChatId;
}

let liveChatId = null;
let nextPageToken = null;

async function getComments(videoId) {
  if (!liveChatId) {
    liveChatId = await getLiveChatId(videoId);
    if (!liveChatId) throw new Error('ライブチャットが見つかりません');
  }

  const response = await youtube.liveChatMessages.list({
    liveChatId,
    part: ['snippet', 'authorDetails'],
    pageToken: nextPageToken
  });

  nextPageToken = response.data.nextPageToken;

  return response.data.items.map(item => ({
    author: item.authorDetails.displayName,
    text: item.snippet.displayMessage
  }));
}

module.exports = { getComments };