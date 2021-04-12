//import redis from "redis";

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener("message", startListening);

const channelWithFilenames = "monitoringChannel";

console.log("hello from worker");

function startListening(event) {
  console.log("filenameListenerWorker.js has been started");

  /*  // redis don't wanna work in browser in the easy way :(
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
}
