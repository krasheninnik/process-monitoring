const redis = require("redis");
//const redisClientSubscriber = redis.createClient();

const subscriber = redis.createClient();

let messageCount = 0;

console.log("Subcribe on alarmchannel:");

subscriber.on("message", function (channel: string, message: string) {
  messageCount += 1;

  console.log(
    "Subscriber received message in channel '" + channel + "': " + message
  );

  if (messageCount === 10) {
    subscriber.unsubscribe();
    subscriber.quit();
  }
});

subscriber.subscribe("alarmchannel");
