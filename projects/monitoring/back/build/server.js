"use strict";
var redis = require("redis");
var ws = require("ws");
//const redisClientSubscriber = redis.createClient();
console.log("Start server");
var wss = new ws.Server({ port: 3001 });
wss.on("connection", function (ws) {
    // ws is a single connection to the server side
    console.log("New client connected!");
    var subscriber = redis.createClient();
    var channelWithFilenames = "monitoringChannel";
    console.log("Subcribe on " + channelWithFilenames + ":");
    subscriber.on("message", function (channel, message) {
        console.log("Subscriber received message in channel '" + channel + "': " + message);
        ws.send(message);
    });
    subscriber.subscribe(channelWithFilenames);
    ws.on("close", function () {
        console.log("Client has disconnectd");
    });
});
