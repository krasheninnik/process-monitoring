"use strict";
var Obserser = require("./services/observer");
var redis = require("redis");
var redisClient = redis.createClient();
redisClient.on("error", function (error) {
    console.error(error);
});
var obserser = new Obserser();
var sourceFolder = "files/to_process";
var storageFolder = "files/processed";
obserser.on("file-added", function (msg) {
    // add filePath in message query
    redisClient.lpush("filenamequery", msg.filePath);
    // send signal, that there new file
    redisClient.publish("alarmchannel", 1);
    // log:
    console.log("[" + new Date().toLocaleString() + "] " + msg.filePath + " was added in processing query");
});
obserser.watchFolder(sourceFolder, storageFolder);
