require('dotenv').config();
const { google } = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

async function getComments(videoId) {
  const response = await youtube.commentThreads.list({
    part: ['snippet'],
    videoId: videoId,
    maxResults: 5,
    order: 'time'
  });

  return response.data.items.map(item => ({
    author: item.snippet.topLevelComment.snippet.authorDisplayName,
    text: item.snippet.topLevelComment.snippet.textDisplay
  }));
}

module.exports = { getComments };