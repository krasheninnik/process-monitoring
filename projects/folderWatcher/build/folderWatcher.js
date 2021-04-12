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
var sequentialFileName = 0;
obserser.on("file-added", function (msg) {
    // set await processing status for added file
    redisClient.set(msg.filePath, -1);
    // add filePath in message queue
    redisClient.lpush("filenamequeue", msg.filePath);
    // send signal, that there new file
    redisClient.publish("alarmchannel", sequentialFileName++);
    // save processing filename in the fileSet:
    redisClient.sadd("fileSet", msg.filePath);
    // log:
    console.log("[" + new Date().toLocaleString() + "] " + msg.filePath + " was added in processing query");
});
obserser.watchFolder(sourceFolder, storageFolder);
