const Obserser = require("./services/observer");
const redis = require("redis");

const redisClient = redis.createClient();
redisClient.on("error", function (error: any) {
  console.error(error);
});

var obserser = new Obserser();

const sourceFolder = "files/to_process";
const storageFolder = "files/processed";

let x = 0;

obserser.on("file-added", (msg: { filePath: string }) => {
  // add filePath in message query
  redisClient.lpush("filenamequery", msg.filePath);
  // send signal, that there new file
  redisClient.publish("alarmchannel", x++);
  // log:
  console.log(
    `[${new Date().toLocaleString()}] ${
      msg.filePath
    } was added in processing query`
  );
});

obserser.watchFolder(sourceFolder, storageFolder);
