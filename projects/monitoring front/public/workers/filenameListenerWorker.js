//import redis from "redis";
const channelWithFilenames = "monitoringChannel";

this.onmessage = (e) => {
  console.log("filenameListenerWorker.js has been started");

  /*
  const redisClient = redis.createClient();
  redisClient.on("error", function (error) {
    console.error(error);
  });
  var subscriber = redis.createClient();
  console.log(`filenameListenerWorker subscribe on ${channelWithFilenames}:`);
  subscriber.subscribe("channelWithFilenames");

  subscriber.on("message", function (channel, message) {
    // redirect filename to main thread
    console.log(`got filename ${message}`);
    this.postMessage(message);
  });
  */
  this.postMessage("It is answer from the worker");
};
