const chokidar = require("chokidar");
const EventEmitter = require("events").EventEmitter;

class Observer extends EventEmitter {
  constructor() {
    super();
  }

  watchFolder(sourceFolder: string, storageFolder: string) {
    try {
      console.log(
        `[${new Date().toLocaleString()}] Watching for folder changes on: ${sourceFolder}`
      );

      var watcher = chokidar.watch(sourceFolder, { persistent: true });

      watcher.on("add", async (filePath: string) => {
        if (filePath.includes("to_process.json")) {
          console.log(
            `[${new Date().toLocaleString()}] ${filePath} has been added`
          );

          // emit an event when new file has been added
          this.emit("file-added", {
            filePath: filePath,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Observer;
