const chokidar = require("chokidar");
const EventEmitter = require("events").EventEmitter;
const fsExtra = require("fs-extra");

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
            `[${new Date().toLocaleString()}] ${filePath} has been added.`
          );

          // Read content of new file
          var fileContent = await fsExtra.readFile(filePath);

          // emit an event when new file has been added
          this.emit("file-added", {
            message: fileContent.toString(),
          });

          const sourceFolderParts = sourceFolder.split("/");
          const sourceFolderName =
            sourceFolderParts[sourceFolderParts.length - 1];

          const storageFolderParts = storageFolder.split("/");
          const storageFolderName =
            storageFolderParts[storageFolderParts.length - 1];

          const storagedFilePath = filePath.replace(
            sourceFolderName,
            storageFolderName
          );

          // move processed file
          await fsExtra.move(filePath, storagedFilePath, (err: Error) => {
            if (err) return console.error(err);
            console.log(
              `[${new Date().toLocaleString()}] ${filePath} has been moved.`
            );
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Observer;
