const Obserser = require("./services/observer");

var obserser = new Obserser();

const folder = "Performance/logs";

obserser.on("file-added", (log) => {
  // print error message to console
  console.log(log.message);
});

obserser.watchFolder(folder);
