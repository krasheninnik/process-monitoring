const redis = require("redis");
const ws = require("ws");

interface ProgressInformation {
  filename: string;
  progress: string;
}

// once in the checking time interval get information about
// progress in file processing
const checkingTimeInterval = 1000;

console.log("Start server");
const wss = new ws.Server({ port: 3001 });

wss.on("connection", (ws: any) => {
  // ws is a single connection to the server side
  console.log("New client connected");
  const redisClient = redis.createClient();

  ws.on("close", () => {
    console.log("Client has disconnectd");
  });

  // check once in ckeckingTimeInterval
  setInterval(() => {
    // get all processed files:
    redisClient.smembers("fileSet", function (err: any, filenames: string[]) {
      let filesProgress: ProgressInformation[] = [];

      // for each file get information about its processing progress
      for (let i in filenames) {
        redisClient.get(filenames[i], function (err: any, progress: string) {
          // get progress for each file and save in array
          filesProgress.push({ filename: filenames[i], progress: progress });

          // when all files have been checked, send filesProgress to client
          if (parseInt(i) == filenames.length - 1) {
            ws.send(JSON.stringify(filesProgress));
          }
        });
      }
    });
  }, checkingTimeInterval);
});
