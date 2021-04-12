const redis = require("redis");
const ws = require("ws");

//const redisClientSubscriber = redis.createClient();
console.log("Start server");
const wss = new ws.Server({ port: 3001 });

wss.on("connection", (ws: any) => {
  // ws is a single connection to the server side
  console.log("New client connected!");

  const subscriber = redis.createClient();
  const channelWithFilenames = "monitoringChannel";
  console.log(`Subcribe on ${channelWithFilenames}:`);

  subscriber.on("message", function (channel: string, message: string) {
    console.log(
      "Subscriber received message in channel '" + channel + "': " + message
    );

    ws.send(message);
  });

  subscriber.subscribe(channelWithFilenames);

  ws.on("close", () => {
    console.log("Client has disconnectd");
  });
});
