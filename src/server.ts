const Obserser = require("./services/observer");

var obserser = new Obserser();

const sourceFolder = "files/to_process";
const storageFolder = "files/processed";

obserser.on("file-added", (log: Error) => {
  // print error message to console
  console.log(log.message);
});

obserser.watchFolder(sourceFolder, storageFolder);
