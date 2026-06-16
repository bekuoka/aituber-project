const { ApiClient } = require('vtubestudio');

let client;

async function connect() {
  client = new ApiClient({
    authenticationAppName: 'AItuber',
    authenticationDeveloper: 'bekuoka',
  });

  await client.connect();
  console.log('VTube Studio接続成功！');
}

async function triggerExpression(expressionName) {
  if (!client) return;
  try {
    await client.expressionActivation({
      expressionFile: expressionName,
      active: true
    });
  } catch (err) {
    console.error('表情エラー:', err.message);
  }
}

module.exports = { connect, triggerExpression };