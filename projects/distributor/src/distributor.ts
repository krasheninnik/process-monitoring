const redis = require("redis");
//const redisClientSubscriber = redis.createClient();

const subscriber = redis.createClient();
const publisher = redis.createClient();

let messageCount = 0;

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

publisher.publish("alarmchannel", "what the fuck is happen there?");
publisher.publish("alarmchannel", "hello world");
publisher.publish("alarmchannel", "i dont understand this");
