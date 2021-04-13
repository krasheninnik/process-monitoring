const Obserser = require("./services/observer");
const redis = require("redis");

// files location:
const sourceFolder = "files/to_process";
const storageFolder = "files/processed";

// create redis client
const redisClient = redis.createClient();
redisClient.on("error", function (error: any) {
  console.error(error);
});

// clear redit:
redisClient.flushall(() => console.log("redis: flush all"));

// create folderWatcher on sourceFolder:
let sequentialFileName = 0;
const observer = new Obserser();
observer.on("file-added", (msg: { filePath: string }) => {
  // set "await processing" (-1) status for added file
  redisClient.set(msg.filePath, -1);
  // add filePath in message queue
  redisClient.lpush("filenamequeue", msg.filePath);
  // send signal, that there new file
  redisClient.publish("alarmchannel", sequentialFileName++);
  // save processing filename in the fileSet:
  redisClient.sadd("fileSet", msg.filePath);

  console.log(
    `[${new Date().toLocaleString()}] ${
      msg.filePath
    } was added in processing query`
  );
});

observer.watchFolder(sourceFolder, storageFolder);
