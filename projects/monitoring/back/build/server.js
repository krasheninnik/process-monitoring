"use strict";
var redis = require("redis");
var ws = require("ws");
// once in the checking time interval get information about
// progress in file processing
var checkingTimeInterval = 1000;
console.log("Start server");
var wss = new ws.Server({ port: 3001 });
wss.on("connection", function (ws) {
    // ws is a single connection to the server side
    console.log("New client connected");
    var redisClient = redis.createClient();
    ws.on("close", function () {
        console.log("Client has disconnectd");
    });
    // check once in ckeckingTimeInterval
    setInterval(function () {
        // get all processed files:
        redisClient.smembers("fileSet", function (err, filenames) {
            var filesProgress = [];
            var _loop_1 = function (i) {
                redisClient.get(filenames[i], function (err, progress) {
                    // get progress for each file and save in array
                    filesProgress.push({ filename: filenames[i], progress: progress });
                    // when all files have been checked, send filesProgress to client
                    if (parseInt(i) == filenames.length - 1) {
                        console.log(JSON.stringify(filesProgress));
                        ws.send(JSON.stringify(filesProgress));
                    }
                });
            };
            // for each file get information about its processing progress
            for (var i in filenames) {
                _loop_1(i);
            }
        });
    }, checkingTimeInterval);
});
