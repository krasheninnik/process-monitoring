"use strict";
var redis = require("redis");
//const redisClientSubscriber = redis.createClient();
var subscriber = redis.createClient();
var publisher = redis.createClient();
var messageCount = 0;
subscriber.on("message", function (channel, message) {
    messageCount += 1;
    console.log("Subscriber received message in channel '" + channel + "': " + message);
    if (messageCount === 10) {
        subscriber.unsubscribe();
        subscriber.quit();
    }
});
subscriber.subscribe("alarmchannel");
publisher.publish("alarmchannel", "what the fuck is happen there?");
publisher.publish("alarmchannel", "hello world");
publisher.publish("alarmchannel", "i dont understand this");
