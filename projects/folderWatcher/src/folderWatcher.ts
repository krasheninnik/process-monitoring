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
  // add filePath in message query
  redisClient.lpush("filenamequery", msg.filePath);
  // set await processing status for added file
  redisClient.set(msg.filePath, -1);
  // send signal, that there new file
  redisClient.publish("alarmchannel", sequentialFileName++);
  // log:
  console.log(
    `[${new Date().toLocaleString()}] ${
      msg.filePath
    } was added in processing query`
  );
});

obserser.watchFolder(sourceFolder, storageFolder);
