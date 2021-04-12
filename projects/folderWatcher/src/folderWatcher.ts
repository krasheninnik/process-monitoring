const Obserser = require("./services/observer");
const redis = require("redis");

const redisClient = redis.createClient();
redisClient.on("error", function (error: any) {
  console.error(error);
});

var obserser = new Obserser();

const sourceFolder = "files/to_process";
const storageFolder = "files/processed";

let sequentialFileName = 0;

obserser.on("file-added", (msg: { filePath: string }) => {
  // set await processing status for added file
  redisClient.set(msg.filePath, -1);
  // add filePath in message queue
  redisClient.lpush("filenamequeue", msg.filePath);
  // send signal, that there new file
  redisClient.publish("alarmchannel", sequentialFileName++);
  // save processing filename in the fileSet:
  redisClient.sadd("fileSet", msg.filePath);

  // log:
  console.log(
    `[${new Date().toLocaleString()}] ${
      msg.filePath
    } was added in processing query`
  );
});

obserser.watchFolder(sourceFolder, storageFolder);
