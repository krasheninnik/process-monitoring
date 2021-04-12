/* eslint-disable-next-line no-restricted-globals */
self.addEventListener("message", startListening);

function startListening(event) {
  console.log("filenameListenerWorker.js has been started");

  const ws = new WebSocket("ws://localhost:3001");

  ws.addEventListener("message", ({ data }) => {
    // redirect filename to main thread
    console.log(`got filename ${data}`);
    this.postMessage(data);
  });

  this.postMessage("It is answer from the worker");
}
