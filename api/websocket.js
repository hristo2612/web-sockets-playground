const { insertMessage, getMessages } = require('./mongodb');

const webSocketCallback = (expressWs) => async (ws, req) => {
  ws.on('message', (message) => {
    insertMessage(JSON.parse(message).data);
    const allClients = expressWs.getWss().clients;
    allClients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        const data = JSON.parse(message).data;
        const msg = JSON.stringify({
          text: data.text,
          userName: data.userName
        });
        client.send(msg);
      }
    });
  });

  const messages = await getMessages();
  ws.send(JSON.stringify(messages));

}

exports.webSocketCallback = webSocketCallback;